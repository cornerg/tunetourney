import { Link } from "@tanstack/react-router";
import { useCurrentUser } from "#/api/users.ts";
import ButtonDiscordLogin from "#/components/ButtonDiscordLogin.tsx";
import { useBreakpoints } from "#/hooks/utils.ts";

import logo from "../../../assets/images/logo1.png";
import HeaderLoggedIn from "#/components/sections/header/HeaderLoggedIn.tsx";
import { cn } from "#/utils/utils.ts";

export const HEADER_HEIGHT = 52;

export default function Header() {
  const { isMobile } = useBreakpoints();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 row w-screen pr-[3vw] py-2 justify-between items-center bg-surface z-10",
          {
            "pl-4 pr-4": isMobile,
            "pl-8": !isMobile,
          }
          )}
        style={{ height: `${HEADER_HEIGHT}px` }}>
        <Link className="row items-center w-max gap-3 cursor-pointer" to="/">
          <img
            src={logo}
            alt="logo"
            width={36}
            height={36}
            style={{ minWidth: "36px", minHeight: "36px" }}
          />
          {!isMobile && (
            <p className="text-2xl font-bold text-primary">Tune Tourney</p>
          )}
        </Link>

        <div className="row justify-end items-center gap-2 w-full flex-1">
          {!currentUser && !isUserLoading && <ButtonDiscordLogin />}

          {currentUser?.id && (
            <HeaderLoggedIn currentUser={currentUser} />
          )}
        </div>
      </header>

      <div
        className="fixed top-0 left-0 w-screen shadow-md"
        style={{ height: `${HEADER_HEIGHT}px`, zIndex: 3 }}
      />
    </>
  );
}
