import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useInsertUser } from "#/api/Users/insertUser.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useLoadScreen } from "#/state/loadscreenState.ts";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const { show, hide } = useLoadScreen();
  const navigate = useNavigate();
  const { mutateAsync: insertUser } = useInsertUser();
  const queryClient = useQueryClient();

  const handleSignIn = React.useCallback(async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        throw new Error("User was not logged in");
      }
      const { data: currentUserData, error } = await supabase
        .from("Users")
        .select("*")
        .eq("id", data.user.id);

      if (error) {
        throw new Error(error.message);
      }
      if (!currentUserData?.length) {
        show("Signing up");
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
        const newUser = await insertUser({ id, name, avatar });
        if (!newUser) {
          throw new Error("No user returned from insert");
        }
        return newUser;
      }
    } catch (e) {
      console.log("Error creating user data: ", e);
    } finally {
      hide();
      await navigate({ to: "/dashboard" });
    }
  }, [show, hide, navigate, insertUser]);

  const handleSignout = React.useCallback(async () => {
    show("Logging you out");
    let isSuccessful = false;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData) return;
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out: ", error);
      } else {
        isSuccessful = true;
      }
    } finally {
      hide();
      if (isSuccessful) {
        const queryKey = ["currentUser"];
        await queryClient.setQueryData(queryKey, () => null);
        await queryClient.invalidateQueries({ queryKey });
        await navigate({ to: "/" });
      }
    }
  }, [show, hide, queryClient, navigate]);

  return { signIn: handleSignIn, signOut: handleSignout };
}
