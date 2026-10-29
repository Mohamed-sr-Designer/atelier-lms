"use client";

// ---- Cloud auth + sync ---------------------------------------------------------
// Only active when Supabase is configured (lib/cloud.ts). Signs students in,
// pulls their profile/enrollments/progress into the local store, and pushes
// progress back (debounced) whenever the store changes. The admin's studio
// edits are published the same way through site_settings.

import { cloud, sb } from "@/lib/cloud";
import {
  getState,
  hydrate,
  onLogout,
  onStoreWrite,
  type StoreState,
  type User,
} from "@/lib/store";
import { hydrateStudio, onStudioWrite, type Studio } from "@/lib/studio";
import { site } from "@/lib/site";

const PROGRESS_KEYS = [
  "completed",
  "quizPassed",
  "archived",
  "activity",
  "goal",
  "lastLesson",
  "positions",
  "notes",
] as const;

const progressOf = (s: StoreState) =>
  Object.fromEntries(PROGRESS_KEYS.map((k) => [k, s[k]]));

let lastProgress = "";
let lastProfile = "";
let timer: ReturnType<typeof setTimeout> | null = null;

async function pushProgress(s: StoreState) {
  const u = s.user;
  if (!u?.id) return;
  const data = progressOf(s);
  const json = JSON.stringify(data);
  if (json !== lastProgress) {
    lastProgress = json;
    await sb()
      .from("student_state")
      .upsert({ user_id: u.id, data, updated_at: new Date().toISOString() });
  }
  const profile = JSON.stringify({ name: u.name, phone: u.phone, avatar: u.avatar });
  if (profile !== lastProfile) {
    lastProfile = profile;
    await sb()
      .from("profiles")
      .update({ name: u.name, phone: u.phone || null, avatar: u.avatar || null })
      .eq("id", u.id);
  }
}

async function loadUser(id: string, email: string) {
  const [p, e, st] = await Promise.all([
    sb().from("profiles").select("*").eq("id", id).maybeSingle(),
    sb().from("enrollments").select("course_slug").eq("user_id", id),
    sb().from("student_state").select("data").eq("user_id", id).maybeSingle(),
  ]);
  const prof = p.data || {};
  const user: User = {
    id,
    name: prof.name || email.split("@")[0],
    email,
    phone: prof.phone || undefined,
    avatar: prof.avatar || undefined,
    role: prof.role === "admin" ? "admin" : "user",
    joined: prof.created_at || new Date().toISOString(),
  };
  const data = (st.data?.data || {}) as Partial<StoreState>;
  const next = {
    ...data,
    user,
    enrollments: (e.data || []).map((r: { course_slug: string }) => r.course_slug),
  };
  hydrate(next);
  lastProgress = JSON.stringify(progressOf(getState()));
  lastProfile = JSON.stringify({ name: user.name, phone: user.phone, avatar: user.avatar });
}

async function loadStudio() {
  const { data } = await sb().from("site_settings").select("value").eq("key", "studio").maybeSingle();
  if (data?.value) hydrateStudio(data.value as Studio);
}

let started = false;

export function startSync() {
  if (!cloud || started) return;
  started = true;

  loadStudio().catch(() => {});

  sb()
    .auth.getSession()
    .then(({ data }) => {
      const u = data.session?.user;
      if (u) loadUser(u.id, u.email || "").catch(() => {});
      else if (getState().user) hydrate({}); // stale demo/local login
    });

  sb().auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") hydrate({});
    // arrived from the "reset password" e-mail link
    if (event === "PASSWORD_RECOVERY") {
      const pw = window.prompt("New password (8+ characters) / كلمة سر جديدة");
      if (pw && pw.length >= 8) sb().auth.updateUser({ password: pw }).then(() => {});
    }
    if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
      loadUser(session.user.id, session.user.email || "").catch(() => {});
    }
  });

  onLogout(() => {
    signOut().catch(() => hydrate({}));
  });

  onStoreWrite((next) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => pushProgress(next).catch(() => {}), 1200);
  });

  onStudioWrite((next) => {
    if (getState().user?.role !== "admin") return;
    sb()
      .from("site_settings")
      .upsert({ key: "studio", value: next, updated_at: new Date().toISOString() })
      .then(() => {});
  });
}

// ------------------------------------------------------------------- auth
export async function signUp(name: string, email: string, phone: string, password: string) {
  const { data, error } = await sb().auth.signUp({
    email,
    password,
    options: { data: { name, phone }, emailRedirectTo: `${site.url}/dashboard/` },
  });
  if (error) throw new Error(error.message);
  // null session = the project requires e-mail confirmation first
  return { needsConfirm: !data.session };
}

export async function signIn(email: string, password: string) {
  const { error } = await sb().auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  await sb().auth.signOut();
  hydrate({});
}

export async function resetPassword(email: string) {
  const { error } = await sb().auth.resetPasswordForEmail(email, {
    redirectTo: `${site.url}/profile/`,
  });
  if (error) throw new Error(error.message);
}
