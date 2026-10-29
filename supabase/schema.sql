-- Mohamed Tarek Academy: database schema for Supabase.
-- Paste this whole file into Supabase > SQL Editor > New query > Run.
-- Safe to run again: every object is created "if not exists" / replaced.

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text,
  avatar text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Admin check used by every policy below. security definer so it can read
-- profiles without tripping the profiles policies themselves.
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- A profile row is created for every new account, from the sign-up metadata.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  insert into student_state (user_id) values (new.id) on conflict do nothing;
  return new;
end $$;

-- Students may edit their own name/phone/avatar but never their role.
create or replace function public.lock_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not is_admin() then
    new.role := old.role;
  end if;
  return new;
end $$;

drop trigger if exists profiles_lock_role on public.profiles;
create trigger profiles_lock_role before update on public.profiles
  for each row execute function public.lock_role();

-- ------------------------------------------------------------ student_state
-- Progress, quiz results, notes, study minutes: one JSON row per student.
create table if not exists public.student_state (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------- enrollments
create table if not exists public.enrollments (
  user_id uuid not null references auth.users on delete cascade,
  course_slug text not null,
  source text not null default 'free' check (source in ('free', 'order', 'admin')),
  created_at timestamptz not null default now(),
  primary key (user_id, course_slug)
);

-- The two free courses. Keep in sync with the courses priced 0 on the site.
create or replace function public.is_free_course(slug text) returns boolean
language sql immutable as $$
  select slug in ('adobe-photoshop', 'adobe-illustrator');
$$;

-- ------------------------------------------------------------------ orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  user_name text not null default '',
  user_email text not null default '',
  user_phone text,
  title text not null,
  course_slugs text[] not null,
  amount integer not null,
  promo text,
  method text not null,
  reference text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- ------------------------------------------------------------- submissions
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  user_name text not null default '',
  course_slug text not null,
  link text not null,
  note text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'changes')),
  feedback text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- --------------------------------------------------------------- questions
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  user_name text not null default '',
  course_slug text not null,
  lesson_id text not null,
  body text not null,
  answer text,
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------ certificates
create table if not exists public.certificates (
  id text primary key, -- e.g. MT-26-7KQ4XP, printed on the certificate
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  course_slug text not null,
  course_title text not null,
  issued_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

-- ------------------------------------------------------------ lesson_media
-- Video per lesson. Paid lessons are only readable by enrolled students.
create table if not exists public.lesson_media (
  lesson_id text primary key,
  course_slug text not null,
  url text not null,
  free boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------- site_settings
-- The studio blob (price overrides, offer ribbon, drafts). Public read.
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ===================================================================== RLS
alter table public.profiles enable row level security;
alter table public.student_state enable row level security;
alter table public.enrollments enable row level security;
alter table public.orders enable row level security;
alter table public.submissions enable row level security;
alter table public.questions enable row level security;
alter table public.certificates enable row level security;
alter table public.lesson_media enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles for select
  using (id = auth.uid() or is_admin());
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles for update
  using (id = auth.uid() or is_admin());

drop policy if exists "state self" on public.student_state;
create policy "state self" on public.student_state for all
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

drop policy if exists "enroll read" on public.enrollments;
create policy "enroll read" on public.enrollments for select
  using (user_id = auth.uid() or is_admin());
-- students can only self-enroll in free courses; paid access comes from
-- an approved order (inserted by the admin).
drop policy if exists "enroll free" on public.enrollments;
create policy "enroll free" on public.enrollments for insert
  with check ((user_id = auth.uid() and is_free_course(course_slug)) or is_admin());
drop policy if exists "enroll admin delete" on public.enrollments;
create policy "enroll admin delete" on public.enrollments for delete using (is_admin());

drop policy if exists "orders read" on public.orders;
create policy "orders read" on public.orders for select
  using (user_id = auth.uid() or is_admin());
drop policy if exists "orders create" on public.orders;
create policy "orders create" on public.orders for insert
  with check (user_id = auth.uid() and status = 'pending');
drop policy if exists "orders admin" on public.orders;
create policy "orders admin" on public.orders for update using (is_admin());

drop policy if exists "subs read" on public.submissions;
create policy "subs read" on public.submissions for select
  using (user_id = auth.uid() or is_admin() or status = 'approved');
drop policy if exists "subs create" on public.submissions;
create policy "subs create" on public.submissions for insert
  with check (user_id = auth.uid() and status = 'pending');
drop policy if exists "subs admin" on public.submissions;
create policy "subs admin" on public.submissions for update using (is_admin());

-- answered questions are public (everyone learns from them), unanswered
-- ones only visible to the asker and the admin
drop policy if exists "q read" on public.questions;
create policy "q read" on public.questions for select
  using (answer is not null or user_id = auth.uid() or is_admin());
drop policy if exists "q create" on public.questions;
create policy "q create" on public.questions for insert
  with check (user_id = auth.uid() and answer is null);
drop policy if exists "q admin" on public.questions;
create policy "q admin" on public.questions for update using (is_admin());
drop policy if exists "q admin delete" on public.questions;
create policy "q admin delete" on public.questions for delete using (is_admin());

-- certificates are public so anyone can verify one by its id
drop policy if exists "cert read" on public.certificates;
create policy "cert read" on public.certificates for select using (true);
drop policy if exists "cert admin" on public.certificates;
create policy "cert admin" on public.certificates for insert with check (is_admin());

drop policy if exists "media read" on public.lesson_media;
create policy "media read" on public.lesson_media for select using (
  free or is_admin() or exists (
    select 1 from enrollments e
    where e.user_id = auth.uid() and e.course_slug = lesson_media.course_slug
  )
);
drop policy if exists "media admin" on public.lesson_media;
create policy "media admin" on public.lesson_media for all
  using (is_admin()) with check (is_admin());

drop policy if exists "settings read" on public.site_settings;
create policy "settings read" on public.site_settings for select using (true);
drop policy if exists "settings admin" on public.site_settings;
create policy "settings admin" on public.site_settings for all
  using (is_admin()) with check (is_admin());

-- ======================================================== make me admin
-- After you register on the site with your own email, run this ONE line
-- (change the email) to give your account the admin role:
--
--   update public.profiles set role = 'admin' where email = 'mohamed.tarek.ahmed1@gmail.com';
