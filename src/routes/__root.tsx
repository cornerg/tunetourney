import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import appCss from '../styles.css?url'
import '../styles/flex.css';
import '../styles/font.css';
import '../styles/theme.css';
import type { QueryClient } from '@tanstack/react-query'
import * as React from "react";
import Header, {HEADER_HEIGHT} from "#/components/Header.tsx";
import Sidebar from "#/components/Sidebar.tsx";
import InternalPage from "#/components/InternalPage.tsx";
import LoadScreen from "#/components/LoadScreen.tsx";
import {useAuth} from "#/hooks/auth.tsx";

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const location = useRouterState({ select: (s) => s.location });
  const isInternal = React.useMemo(() => !["", "/", "/login"].includes(location.pathname), [location.pathname]);
  const { signIn } = useAuth();

  React.useEffect(() => {
    if ((location.search as { signin?: boolean })?.signin === true) {
      signIn();
    }
  }, [location, signIn]);

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <title>Tune Tourney</title>
      </head>
      <body style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT ?? 52}px)` }}>
        <LoadScreen />
        <Header />
        {isInternal && <Sidebar />}
        {isInternal && <InternalPage>{children}</InternalPage>}
        {!isInternal && children}
        <Scripts />
      </body>
    </html>
  )
}
