import React from "react";

const BREAKPOINT_MOBILE = 576;
const BREAKPOINT_DESKTOP = 1024;
const gradients = [
  { start: "#1C75BC", end: "#33C8B4" },
  { start: "#ffa070", end: "#fffa70" },
  { start: "#ffaaf2", end: "#a78eff" },
  { start: "#e5ea5b", end: "#6ad87c" },
];

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

export function getGradient(seed?: number) {
  const number = typeof seed === "number" && !isNaN(seed) && seed > 0 ? seed : Math.round(Math.random() * gradients.length);
  return gradients[number % gradients.length];
}