import {createFileRoute, Outlet, redirect} from '@tanstack/react-router'

function ClubPage() {
  return <Outlet />
}

export const Route = createFileRoute('/club')({
  beforeLoad: (context) => {
    if (context.location.pathname === "/club") {
      throw redirect({ to: "/club/$clubId", params: { clubId: "new" }, replace: true });
    }
  },
  component: ClubPage,
})
