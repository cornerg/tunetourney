import {createFileRoute} from '@tanstack/react-router';
import {useBreakpoints} from "#/hooks/utils.ts";

function Login() {
  const { isMobile, isTablet, isDesktop } = useBreakpoints();

  return (
    <div className="row gap-0">
      <div className="column min-w-[50vw] min-h-[100vh] p-4 justify-center items-center gap-2">
        <p className="text-center">Content Left</p>
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

      <div className="column min-w-[50vw] min-h-[100vh] p-4 justify-center items-center">
        <p className="text-center">Content Right</p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/login')({
  component: Login,
})
