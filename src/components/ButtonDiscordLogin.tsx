import React from "react";
import discord from "#/assets/images/DiscordWhite.png";
import { supabase } from "#/integrations/supabase/supabase.ts";

export default function ButtonDiscordLogin() {
  const handleLogin = React.useCallback(async () => {
    const baseUrl = window.location.origin;
    const destination =
      baseUrl + (baseUrl.includes("?") ? "&" : "?") + "signin=true";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: destination },
    });
    if (error) console.error("Error signing in: ", error);
  }, []);

  return (
    <div
      className={`row justify-between items-center gap-2 w-max h-max px-3 py-1 rounded-full cursor-pointer bg-[#5865F2] hover:bg-[#31358E] transition-colors`}>
      <p className="text-white font-bold text-sm" onClick={handleLogin}>
        Log in with Discord
      </p>
      <img src={discord} alt="Discord logo" className="w-[20px] h-[20px]" />
    </div>
  );
}
