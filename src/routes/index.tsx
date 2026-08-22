import { createFileRoute, redirect } from "@tanstack/react-router";
import background from "@/assets/images/HomeBG1Final.jpg";
import discord from "#/assets/images/DiscordWhite.png";
import React from "react";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useBreakpoints } from "#/hooks/utils.ts";
import { cn } from "#/utils/utils.ts";
import { checkLogin } from "#/api/auth/checkLogin.ts";
import logo from "#/assets/images/logo1.png";

function Home() {
  const { isDesktop, isTablet, isMobile } = useBreakpoints();

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
      className="relative column w-screen h-screen bg-cover bg-bottom-right"
      style={{ backgroundImage: `url(${background})` }}>
      <div className="absolute row w-full top-[3vh] left-[3vw] gap-6 z-2">
        <img
          src={logo}
          alt="logo"
          width={48}
          height={48}
          style={{ minWidth: "48px", minHeight: "48px" }}
        />
        {!isMobile && (
          <p className="text-4xl font-bold text-primary">Tune Tourney</p>
        )}
      </div>

      <div
        className={cn(
          "column w-full h-full max-w-5xl mx-auto gap-32",
          {
            "py-[20vh]": isDesktop,
            "pt-[15vh] px-[10vw]": isTablet,
            "pt-[15vh] px-[5vw] items-center backdrop-blur-sm": isMobile,
          },
        )}>
        <h1
          className={cn("text-dark serif", {
            "text-8xl": isDesktop,
            "text-7xl": isTablet,
            "text-5xl text-shadow-lg text-shadow-gray-200": isMobile,
          })}>
          The <strong className="text-primary">better</strong>
          <br />
          music contest
          <br />
          platform.
        </h1>

        <div
          className="column w-full gap-8"
          style={isMobile ? { alignItems: "center" } : undefined}>
          <div className="row justify-between items-center gap-2 w-max h-max px-4 py-2 rounded-full cursor-pointer border-5 border-white bg-[#5865F2] hover:bg-[#31358E] transition-colors">
            <p
              className={cn("text-white font-bold text-lg", {
                "text-lg": isDesktop,
                "text-sm": isTablet,
                "text-xs": isMobile,
              })}
              onClick={handleLogin}>
              Get started now with <strong>Discord</strong>
            </p>
            <img
              src={discord}
              alt="Discord logo"
              className={cn({
                "w-8 h-8": isDesktop,
                "w-7 h-7": isTablet,
                "w-5 h-5": isMobile,
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  beforeLoad: async context => {
    if (!(context.search as { signin?: boolean })?.signin) {
      const isLoggedIn = await checkLogin();
      if (isLoggedIn) {
        throw redirect({ to: "/dashboard" });
      }
    }
  },
  component: Home,
  ssr: false,
});
