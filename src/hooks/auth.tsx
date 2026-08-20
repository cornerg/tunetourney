import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useSessionToken } from "#/api/auth/sessionToken.ts";
import { useUsers } from "#/api/Users/fetchUsers.ts";
import { useInsertUser } from "#/api/Users/insertUser.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { getContext } from "#/integrations/tanstack-query/root-provider.tsx";
import { useLoadScreen } from "#/state/loadscreenState.ts";

const { queryClient } = getContext();

export function useAuth() {
  const { show, hide } = useLoadScreen();
  const navigate = useNavigate();
  const { data: users } = useUsers();
  const { mutate: insertUser } = useInsertUser();
  const userToken = useSessionToken();
  const currentUserId = useCurrentUserId();

  const handleSignIn = React.useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const currentUserData = users?.find(user => user.id === data.user.id);
    if (!currentUserData) {
      show("Signing up");
      try {
        const id = data.user.id;
        let name = "";
        let avatar = "";
        if (data.user.app_metadata.provider === "discord") {
          const userdata = data.user.user_metadata;
          name =
            userdata?.global_name ??
            (userdata?.custom_claims as { global_name?: string | undefined })?.global_name ??
            userdata?.full_name ??
            userdata?.name ??
            "";
          avatar = userdata.avatar_url ?? userdata.picture ?? "";
        }
        insertUser({ id, name, avatar });
      } catch (e) {
        console.log("Error creating user data: ", e);
      } finally {
        hide();
        await navigate({ to: "/dashboard" });
      }
    }
  }, [show, hide, navigate, users, insertUser]);

  const handleSignout = React.useCallback(async () => {
    show("Logging you out");
    let isSuccessful = false;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out: ", error);
      } else {
        isSuccessful = true;
      }
    } finally {
      hide();
      if (isSuccessful) {
        await queryClient.invalidateQueries({
          queryKey: ["users", userToken, currentUserId],
        });
        await navigate({ to: "/login" });
      }
    }
  }, [show, hide, userToken, currentUserId, navigate]);

  return { signIn: handleSignIn, signOut: handleSignout };
}
