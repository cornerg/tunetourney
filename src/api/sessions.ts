import React from "react";
import {supabase} from "#/integrations/supabase/supabase.ts";

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
  console.log("UserId: ", userId);
  return userId;
}