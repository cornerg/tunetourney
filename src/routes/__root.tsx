import {
  HeadContent,
  Scripts,
  createRootRouteWithContext, useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'
import '../styles/flex.css';
import '../styles/font.css';
import '../styles/theme.css';
import type { QueryClient } from '@tanstack/react-query'
import * as React from "react";
import Header, {HEADER_HEIGHT} from "#/components/Header.tsx";
import Sidebar from "#/components/Sidebar.tsx";
import InternalPage from "#/components/InternalPage.tsx";
import {supabase} from "#/integrations/supabase/supabase.ts";
import {useInsertUser, useUserData} from "#/api/users.ts";

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
  const isInternal = React.useMemo(() => !["", "/", "/home"].includes(location.pathname), [location.pathname]);

  const { data: users } = useUserData();
  const { mutate: insertUser } = useInsertUser();

  const handleSignin = React.useCallback(async () => {
    console.log("Handle signin");
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const currentUserData = users?.find((user) => user.id === data.user.id);
    if (!currentUserData) {
      console.log("Create User Data");
      const id = data.user.id;
      let name = "";
      let avatar = "";
      if (data.user.app_metadata.provider === "discord") {
        const userdata = data.user.user_metadata;
        name = userdata?.global_name ?? userdata?.custom_claims?.global_name ?? userdata?.full_name ?? userdata?.name ?? "";
        avatar = userdata.avatar_url ?? userdata.picture ?? "";
      }
      insertUser({ id, name, avatar });
    }
  }, []);

  React.useEffect(() => {
    if ((location.search as { signin?: boolean })?.signin === true) {
      handleSignin();
    }
  }, [location]);

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <title>Tune Tourney</title>
      </head>
      <body style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
        <Header />
        <Sidebar />
        {isInternal && <InternalPage>{children}</InternalPage>}
        {!isInternal && children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
