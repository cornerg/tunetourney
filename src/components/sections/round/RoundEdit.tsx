import type { Round, Tournament } from "#/models/supabaseTables.ts";
import React from "react";
import { useBreakpoints } from "#/hooks/utils.ts";
import { cn } from "#/utils/utils.ts";
import TTButton from "#/components/primitives/TTButton.tsx";
import { LuSave } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "@tanstack/react-router";
import TTInput from "#/components/primitives/TTInput.tsx";
import { useSaveRound } from "#/hooks/data/useSaveRound.ts";

const defaultRound: Partial<Round> = {
  status: 0,
}

type Props = {
  sourceRound?: Round | null | undefined;
  tournament: Tournament;
  setEdit: (newState: boolean) => void;
}
export default function RoundEdit({ sourceRound, tournament, setEdit }: Props) {
  const [localRound, setLocalRound] = React.useState<Partial<Round>>(defaultRound);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  
  const { isMobile } = useBreakpoints();
  const navigate = useNavigate();
  const { save } = useSaveRound();

  // When source data changes, sync local data with source data
  React.useEffect(() => {
    if ((localRound.id ?? "") !== (sourceRound?.id ?? "")) {
      if (sourceRound?.id) {
        setLocalRound({ ...sourceRound });
      } else {
        setLocalRound({ ...defaultRound });
      }
    }
  }, [localRound, sourceRound, tournament]);

  const editLocal = React.useCallback(
    (newData: Partial<Round>) => {
      setLocalRound({ ...localRound, ...newData });
    },
    [localRound],
  );

  const handleCancel = React.useCallback(async () => {
    if (sourceRound?.id) {
      setEdit(false);
    } else {
      await navigate({ to: "/tournament/$tournamentId", params: { tournamentId: tournament.id } });
    }
  }, [sourceRound?.id, setEdit, navigate, tournament.id]);
  
  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    const isUpdating = !!sourceRound?.id;
    const { success, response } = await save({ ...localRound, tournament_id: tournament.id });
    setIsSaving(false);
    if (success) {
      if (isUpdating) {
        setEdit(false);
      } else {
        void navigate({
          to: "/tournament/$tournamentId/round/$roundId",
          params: { tournamentId: tournament.id, roundId: response?.id ?? "" },
        });
      }
    }
  }, [localRound, navigate, save, setEdit, sourceRound?.id, tournament.id]);
  
  const canSubmit = React.useMemo(() => {
    return !!tournament && !!localRound.title;
  }, [tournament, localRound]);

  return (
    <div className="column w-full h-max p-2 pb-6 gap-4 rounded-3xl rounded-tr-xl overflow-hidden bg-surface border border-gray-400">
      <div
        className={cn("row w-full justify-between items-start gap-2", {
          "pl-2": !isMobile,
        })}>
        <h2 className="subtitle w-full flex-1">
          {sourceRound?.id ? "Edit" : "New"} {sourceRound?.title || "Round"}
        </h2>

        <div className="row w-max items-center gap-1">
          <TTButton
            buttonStyle="outline"
            className="w-8 h-8"
            tooltip="Save"
            disabled={isSaving || !canSubmit}>
            <LuSave size={22} onClick={handleSave} />
          </TTButton>

          <TTButton
            buttonStyle="outline"
            className="w-8 h-8"
            tooltip="Cancel"
            disabled={isSaving}>
            <IoCloseSharp size={22} onClick={handleCancel} />
          </TTButton>
        </div>
      </div>

      <div className="row w-full gap-4 flex-wrap px-2">
        <TTInput
          className="w-full min-w-40 max-w-96 h-10 flex-4"
          inputClassName="text-xl"
          label="Title"
          value={localRound.title ?? ""}
          onChange={e => editLocal({ title: e.target.value })}
        />

        <TTInput
          className="w-full min-w-48 h-10 flex-3"
          label="Description"
          value={localRound.description ?? ""}
          onChange={e => editLocal({ description: e.target.value })}
        />
      </div>
    </div>
  );
}