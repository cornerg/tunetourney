import React from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "#/integrations/supabase/supabase.ts";

export function useSessionToken() {
  const [userToken, setUserToken] = React.useState<string>("");

  const getUserToken = React.useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setUserToken(data.session?.access_token ?? "");
  }, []);

  React.useEffect(() => {
    getUserToken();
  }, []);

  return userToken;
}

export function useCurrentUserId() {
  const [userId, setUserId] = React.useState<string>("");

  const getUserToken = React.useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setUserId(data.session?.user?.id ?? "");
  }, []);

  React.useEffect(() => {
    getUserToken();
  }, []);

  return userId;
}

export async function checkLogin() {
  let supabaseClient = supabase;
  if (!supabaseClient) {
    supabaseClient = createClient(
      "https://uscaefcbuqsjyhtaisho.supabase.co",
      "sb_publishable_iukQlefRIbzwtq0jv6MdEQ_VMBaQfl0",
    );
  }
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    console.error("Error fetching user login. ", error);
    return false;
  }
  if (!data.user?.id) return false;
  if (data.user.banned_until) {
    const bannedUntil = new Date(data.user.banned_until).getTime();
    return bannedUntil > Date.now();
  }
  return true;
}
