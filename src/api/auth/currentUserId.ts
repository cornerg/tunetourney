import React from "react";
import { supabase } from "#/integrations/supabase/supabase.ts";

export function useCurrentUserId() {
  const [userId, setUserId] = React.useState<string>("");

  const getUserToken = React.useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setUserId(data.session?.user?.id ?? "");
  }, []);

  React.useEffect(() => {
    void getUserToken();
  }, [getUserToken]);

  return userId;
}
