import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useClubUsers } from "#/api/ClubUsers/fetchClubUsers.ts";
import { useOwnedClubs } from "#/api/Clubs/fetchOwnedClubs.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useUpdateTournament } from "#/api/Tournaments/updateTournament.ts";
import { useInsertTournament } from "#/api/Tournaments/insertTournament.ts";
import TTButton from "#/components/primitives/TTButton.tsx";
import TTInput from "#/components/primitives/TTInput.tsx";
import TTSelect from "#/components/primitives/TTSelect.tsx";
import { useBreakpoints } from "#/hooks/utils.ts";
import type { Tournament } from "#/models/supabaseTables.ts";
import { allPlatformKeys, getPlatform, type SupportedPlatformKey } from "#/models/SupportedPlatforms.ts";
import { useLoadScreen } from "#/state/loadscreenState.ts";
import { cn, toTitleCase } from "#/utils/utils.ts";
import { IoCloseSharp } from "react-icons/io5";
import { LuSave } from "react-icons/lu";
import { useInsertTournamentUsers } from "#/api/TournamentUsers/insertTournamentUsers.ts";
import { useToast } from "#/state/toastStore.ts";

const roundCounts: number[] = [1, 3, 5, 7, 9];

const defaultTournament: Partial<Tournament> = {
  round_count: 3,
  platform: "all",
}

type Props = {
  sourceTournament?: Tournament | null | undefined;
  existingRounds: number;
  setEdit: (newState: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>
export default function TournamentEdit({
  sourceTournament,
  existingRounds,
  setEdit,
  className,
  ...props
}: Props) {
  const [localTournament, setLocalTournament] = React.useState<
    Partial<Tournament>
  >(defaultTournament);
  const [addAllUsers, setAddAllUsers] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const { isMobile } = useBreakpoints();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { show, hide, changeText } = useLoadScreen();
  const { title, club_id, round_count, platform } = React.useMemo(
    () => localTournament,
    [localTournament],
  );

  const currentUserId = useCurrentUserId();
  const { data: clubs } = useOwnedClubs();
  const { data: clubMembers } = useClubUsers(club_id);
  const { mutateAsync: insertTournament } = useInsertTournament();
  const { mutateAsync: updateTournament } = useUpdateTournament();
  const { mutateAsync: addUsers } = useInsertTournamentUsers();

  // When source data changes, sync local data with source data
  React.useEffect(() => {
    if ((localTournament.id ?? "") !== (sourceTournament?.id ?? "")) {
      if (sourceTournament?.id) {
        setLocalTournament({ ...sourceTournament });
      } else {
        setLocalTournament({ ...defaultTournament });
      }
    }
  }, [localTournament, sourceTournament]);

  const allowedRoundCounts = React.useMemo(() => {
    return roundCounts.filter((count) => !existingRounds || count >= existingRounds);
  }, [existingRounds]);

  const editLocal = React.useCallback(
    (newData: Partial<Tournament>) => {
      setLocalTournament({ ...localTournament, ...newData });
    },
    [localTournament],
  );

  const handleCancel = React.useCallback(async () => {
    if (sourceTournament?.id) {
      setEdit(false);
    } else {
      await navigate({ to: "/tournaments" });
    }
  }, [sourceTournament?.id, setEdit, navigate]);

  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    const saveId = sourceTournament?.id;
    const saveData = { ...localTournament };

    // Iterate through properties to remove unchanged fields
    for (const key of Object.keys(saveData) as (keyof Tournament)[]) {
      if (
        !!sourceTournament?.[key] &&
        sourceTournament?.[key] === saveData[key] &&
        key !== "id"
      )
        delete saveData[key];
    }
    if (!Object.keys(saveData).length) {
      showToast({
        title: "No Unsaved Changes",
        message: "No changes to this tournament were found to save.",
        type: "warning",
      });
      return;
    }

    let response: Tournament | null | undefined;
    try {
      show("Preparing");

      // Save tournament
      if (saveId) {
        changeText("Updating tournament");
        response = await updateTournament({ id: saveId, ...saveData });
      } else {
        changeText("Creating tournament");
        response = await insertTournament({ ...saveData });
      }

      if (!response?.id) {
        throw new Error("Invalid mutation response");
      } else {
        if (!sourceTournament?.id && addAllUsers) {
          const usersToAdd = (clubMembers ?? []).filter((clubUser) => {
            return !!clubUser.userData?.id && clubUser.userData.id !== currentUserId;
          })
          if ((usersToAdd?.length ?? 0) > 0) {
            changeText("Adding members");
            await addUsers(usersToAdd.map((user) => ({ user_id: user.userData?.id, tournament_id: response?.id })));
          }
        }
        hide();
        showToast({
          title: "Tournament Saved",
          message: "The tournament has been saved.",
          type: "success",
        });
        if (saveId) {
          setEdit(false);
        } else {
          await navigate({
            to: "/tournament/$tournamentId",
            params: { tournamentId: response?.id },
          });
        }
      }
    } catch (error) {
      console.error("An error occurred saving Tournament: ", error);
      hide();
      showToast({
        title: "An Error Occurred",
        message: "Your tournament couldn't be saved. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }, [sourceTournament, localTournament, showToast, show, changeText, updateTournament, insertTournament, hide, addAllUsers, clubMembers, currentUserId, addUsers, setEdit, navigate]);

  const canSubmit = React.useMemo(() => {
    return !!club_id && !!title;
  }, [club_id, title]);

  return (
    <div
      className={cn(
        "column w-full h-max p-2 rounded-3xl rounded-tr-xl overflow-hidden bg-surface border border-gray-400",
        className,
      )}
      {...props}>
      <div
        className={cn("row w-full justify-between items-start gap-2", {
          "pl-2": !isMobile,
        })}>
        <h2 className="subtitle w-full flex-1">
          {sourceTournament?.id ? "Edit" : "New"}{" "}
          {sourceTournament?.title || "Tournament"}
        </h2>

        <div className="row w-max items-center gap-1">
          <TTButton
            buttonStyle="outline"
            className="w-8 h-8"
            tooltip="Save"
            disabled={isSaving || !canSubmit}
            onClick={handleSave}>
            <LuSave size={22} className="w-5.5 h-5.5" />
          </TTButton>

          <TTButton
            buttonStyle="outline"
            className="w-8 h-8"
            tooltip="Cancel"
            disabled={isSaving}
            onClick={handleCancel}>
            <IoCloseSharp size={22} className="w-5.5 h-5.5" />
          </TTButton>
        </div>
      </div>

      <div className={cn("column w-full h-max gap-4", { "p-2": !isMobile })}>
        <div className="row w-full items-start gap-4 flex-wrap">
          <TTInput
            className="w-full min-w-40 max-w-96 h-10 flex-1"
            inputClassName="text-xl"
            label="Title"
            value={title ?? ""}
            onChange={e => editLocal({ title: e.target.value })}
          />

          <TTSelect
            className="w-full min-w-40 max-w-96 h-10 flex-1"
            label="Club"
            placeholder="Select club..."
            value={club_id}
            onChange={e => editLocal({ club_id: e.target.value })}>
            {(clubs ?? []).map(club => {
              return (
                <option key={club.id} value={club.id}>
                  {club.title}
                </option>
              );
            })}
          </TTSelect>

          <TTSelect
            className="w-full min-w-40 max-w-96 h-10 flex-1"
            label="Allowed Platforms"
            value={platform}
            onChange={e =>
              editLocal({
                platform: e.target.value as SupportedPlatformKey | undefined,
              })
            }>
            {allPlatformKeys.map(platformKey => {
              const platform = getPlatform(platformKey);
              return (
                <option key={platformKey} value={platformKey}>
                  {toTitleCase(platform?.label ?? platformKey)}
                </option>
              );
            })}
          </TTSelect>

          <TTSelect
            className="w-full min-w-40 max-w-96 h-10 flex-1"
            label="Round Count"
            value={round_count}
            onChange={e =>
              editLocal({ round_count: parseFloat(e.target.value) })
            }>
            {roundCounts.map(count => {
              const isAllowed = allowedRoundCounts.includes(count);
              return (
                <option
                  key={`count-${count}`}
                  value={count}
                  disabled={!isAllowed}>
                  {count}
                </option>
              );
            })}
          </TTSelect>
        </div>

        {!sourceTournament?.id && (
          <div
            className="group row w-full max-w-max gap-2 items-center cursor-pointer"
            onClick={() => setAddAllUsers(!addAllUsers)}>
            <div className="row w-6 h-6 p-0.5 justify-center items-center rounded-lg border-2 border-gray-600 group-hover:border-primary transition-colors">
              <div
                className="bg-primary rounded-[10px]"
                style={{
                  width: addAllUsers ? "1rem" : "0",
                  height: addAllUsers ? "1rem" : "0",
                  transition: "width 200ms ease, height 200ms ease",
                }}
              />
            </div>
            <p className="text-sm font-medium text-dark">
              Add all club members to this tournament upon creation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}