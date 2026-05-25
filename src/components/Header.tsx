import logo from "../assets/images/logo1.png";
import {useBreakpoints} from "#/hooks/utils.ts";
import {Link} from "@tanstack/react-router";
import {useCurrentUser} from "#/api/users.ts";

export const HEADER_HEIGHT = 52;

export default function Header() {
  const { isMobile } = useBreakpoints();

  const { data: currentUser } = useCurrentUser();

  return (
    <>
      <header className="fixed top-0 left-0 row w-[100vw] px-8 py-2 justify-between items-center bg-surface z-10" style={{ height: `${HEADER_HEIGHT}px` }}>
        <Link className="row items-center w-max gap-3 cursor-pointer" to="/">
          <img src={logo} alt="logo" width={36} height={36} style={{ minWidth: "36px", minHeight: "36px" }} />
          {!isMobile && <p className="text-2xl font-bold text-primary">Tune Tourney</p>}
        </Link>

        <div className="row justify-end items-center gap-2 w-full flex-1">
          {currentUser?.avatar && (
            <div className="group relative w-8 h-8 cursor-pointer">
              <img
                className="absolute top-0 left-0 min-w-8 min-h-8 rounded-full overflow-y-hidden bg-surface"
                src={currentUser.avatar}
                alt="user avatar"
                width={32}
                height={32}
                style={{ minWidth: "2rem", minHeight: "2rem", zIndex: 1 }}
              />
              <div
                className="absolute top-0.5 left-0.5 w-7 h-7 m-auto rounded-full border-2 border-primary z-0 group-hover:w-10 group-hover:h-10 group-hover:top-[-4px] group-hover:left-[-4px]"
                style={{ transition: "width 200ms ease, height 200ms ease, top 200ms ease, left 200ms ease" }}
              />
            </div>
          )}
        </div>
      </header>

      <div className="fixed top-0 left-0 w-[100vw] shadow-md" style={{ height: `${HEADER_HEIGHT}px`, zIndex: 3 }} />
    </>
  )
}