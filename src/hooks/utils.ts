import React from "react";

const BREAKPOINT_MOBILE = 576;
const BREAKPOINT_DESKTOP = 1024;

export function useBreakpoints() {
  const [width, setWidth] = React.useState<number>(1920);
  const hasSetListener = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (!hasSetListener.current) {
      hasSetListener.current = true;
      window.addEventListener('resize', () => {
        setWidth(window.innerWidth);
      });
    }
  })

  const breakpoints = React.useMemo(() => {
    const isMobile = width < BREAKPOINT_MOBILE;
    const isTablet = width >= BREAKPOINT_MOBILE && width < BREAKPOINT_DESKTOP;
    const isDesktop = width >= BREAKPOINT_DESKTOP;
    return { isMobile, isTablet, isDesktop };
  }, [width]);

  return { ...breakpoints };
}