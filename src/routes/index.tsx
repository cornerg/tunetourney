import {createFileRoute, redirect} from '@tanstack/react-router';

function Home() {

  return (
    <div className="row gap-0" />
  )
}

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    throw redirect({ to: "/login", replace: true });
  },
  component: Home
});
