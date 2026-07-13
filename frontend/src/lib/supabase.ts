import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Non-fatal in M0: no data features are wired yet. Wired up in M1/M2.
  console.warn(
    "[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
      "Data features are disabled until these are set in your .env / Vercel env."
  );
}

export const supabase = createClient(
  url ?? "http://localhost:54321",
  anonKey ?? "public-anon-key-placeholder"
);
