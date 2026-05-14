import discord from "#/assets/images/DiscordWhite.png";
import React from "react";
import {supabase} from "#/integrations/supabase/supabase.ts";

export default function ButtonDiscordLogin() {
  const handleLogin = React.useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: location.href } });
    console.log("Login data: ");
    console.log(data);
    console.log(error);
  }, []);

  return (
    <div className={`row justify-between items-center gap-2 w-max h-max px-3 py-1 rounded-full cursor-pointer bg-[#5865F2] hover:bg-[#31358E] transition-colors`}>
      <p className="text-white font-bold text-sm" onClick={handleLogin}>Log in with Discord</p>
      <img src={discord} alt="Discord logo" className="w-[20px] h-[20px]" />
    </div>
  )
}