import {useBreakpoints} from "#/hooks/utils.ts";
import ButtonDiscordLogin from "#/components/ButtonDiscordLogin.tsx";
import React from "react";
import {supabase} from "#/integrations/supabase/supabase.ts";

export default function HomeRight() {
  const { isMobile, isTablet, isDesktop } = useBreakpoints();

  const checkSession = React.useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log(data, error);
  }, []);

  const checkData = React.useCallback(async () => {
    const { data, error } = await supabase.from("Clubs").select();
    console.log(data, error);
  }, []);

  const handleLogOut = React.useCallback(async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      console.error("Failed to log out: ", error);
    } else {
      console.log("Logged out");
    }
  }, []);

  return (
    <div className="column min-w-[50vw] min-h-[100vh] p-4 justify-center items-center gap-8">
      <div className="column w-full h-max items-center gap-2">
        <button className="border" onClick={checkData}>Check Data</button>
        <button className="border" onClick={checkSession}>Check Session</button>
        <button className="border" onClick={handleLogOut}>Log Out</button>
        <ButtonDiscordLogin />
      </div>

      <div className="column w-full h-max items-center gap-2">
        <div className="row items-center gap-2 w-max min-w-32">
          <div className="w-5 h-5 rounded-full border-1 border-gray-800 p-0.5">
            <div
              className="rounded-full bg-primary"
              style={{ width: isMobile ? "100%" : 0, height: isMobile ? "100%" : 0, transition: "width 200ms ease, height 200ms ease" }}
            />
          </div>
          <p>Is Mobile</p>
        </div>

        <div className="row items-center gap-2 w-max min-w-32">
          <div className="w-5 h-5 rounded-full border-1 border-gray-800 p-0.5">
            <div
              className="rounded-full bg-primary"
              style={{ width: isTablet ? "100%" : 0, height: isTablet ? "100%" : 0, transition: "width 200ms ease, height 200ms ease" }}
            />
          </div>
          <p>Is Tablet</p>
        </div>

        <div className="row items-center gap-2 w-max min-w-32">
          <div className="w-5 h-5 rounded-full border-1 border-gray-800 p-0.5">
            <div
              className="rounded-full bg-primary"
              style={{ width: isDesktop ? "100%" : 0, height: isDesktop ? "100%" : 0, transition: "width 200ms ease, height 200ms ease" }}
            />
          </div>
          <p>Is Desktop</p>
        </div>
      </div>
    </div>
  )
}
