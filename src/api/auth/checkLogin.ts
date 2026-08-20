import { supabase } from "#/integrations/supabase/supabase.ts";
import { createClient } from "@supabase/supabase-js";

export async function checkLogin() {
  let supabaseClient = supabase;
  if (!supabaseClient) {
    supabaseClient = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_KEY,
    );
  }
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    if (error.name.includes("AuthSessionMissingError")) {
      return false; // No console error required; user is not logged in.
    } else {
      console.error("Error fetching user login. ", error);
      return false;
    }
  }
  if (!data.user?.id) return false;
  if (data.user.banned_until) {
    const bannedUntil = new Date(data.user.banned_until).getTime();
    return bannedUntil > Date.now();
  }
  return true;
}
