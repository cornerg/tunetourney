import { createFileRoute } from "@tanstack/react-router";
import { useCurrentUser } from "#/api/users.ts";
import MyStats from "#/components/sections/MyStats.tsx";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="column gap-4 pt-8">
      <h2 className="title">
        Welcome back
        <span className="text-primary">
          {currentUser?.name ? ` ${currentUser.name}` : ""}
        </span>
      </h2>

      <hr className="w-full text-gray-300 my-4" />

      <MyStats />
    </div>
  );
}
