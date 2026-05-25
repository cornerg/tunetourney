import React from "react";
import {supabase} from "#/integrations/supabase/supabase.ts";
import type {Session} from "@supabase/auth-js";

export function useCurrentUserSession() {
  const [user, setUser] = React.useState<Session | null>(null);
  const getUser = React.useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setUser(data.session);
  }, []);
  React.useEffect(() => {
    getUser();
  })
  return user;
}