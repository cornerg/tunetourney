import React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useClubs } from "#/api/clubs.ts";
import ClubEdit from "#/components/sections/Club/ClubEdit.tsx";
import ClubView from "#/components/sections/Club/ClubView.tsx";

function ClubPage() {
  const [edit, setEdit] = React.useState<boolean>(false);

  const { clubId } = Route.useParams();
  const { data: clubs } = useClubs();
  const handledRoute = React.useRef<string>("");

  React.useEffect(() => {
    if (clubId !== handledRoute.current) {
      handledRoute.current = clubId;
      if (clubId === "new" && !edit) {
        setEdit(true);
      } else if (edit) {
        setEdit(false);
      }
    }
  }, [clubId, edit, handledRoute]);

  const club = React.useMemo(() => {
    if (!clubId || clubId === "new") return;
    return clubs?.find(cl => cl.id === clubId);
  }, [clubId, clubs]);

  return (
    <div className="column w-full h-max rounded-3xl rounded-tr-xl overflow-hidden bg-surface border border-gray-400">
      {!edit && !!club && <ClubView club={club} setEdit={setEdit} />}

      {edit && <ClubEdit sourceClub={club} setEdit={setEdit} />}
    </div>
  );
}

export const Route = createFileRoute("/club/$clubId")({
  beforeLoad: (context) => {
    if ((context.params?.clubId?.length ?? 0) <= 0) {
      throw redirect({ to: "/club/$clubId", params: { clubId: "new" } })
    }
  },
  component: ClubPage,
});
