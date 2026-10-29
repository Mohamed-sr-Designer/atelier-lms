"use client";

// ---- Cloud switch -------------------------------------------------------------
// With NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY set at build
// time, accounts, progress, orders, reviews and settings live in Supabase.
// Without them the site runs in demo mode: everything stays in this browser
// (lib/store.ts + lib/db.ts local tables), which is how it worked before.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const cloud = Boolean(URL && KEY);

let client: SupabaseClient | null = null;

export function sb(): SupabaseClient {
  if (!cloud) throw new Error("Supabase is not configured");
  if (!client) {
    client = createClient(URL, KEY, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: "mt-auth" },
    });
  }
  return client;
}
