import type { Tournament } from "#/models/supabaseTables.ts";
import React from "react";
import { useClubUsers } from "#/api/ClubUsers/fetchClubUsers.ts";
import { useTournamentUsers } from "#/api/TournamentUsers/fetchTournamentUsers.ts";
import ProfilePhoto from "#/components/ProfilePhoto.tsx";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import { useInsertTournamentUsers } from "#/api/TournamentUsers/insertTournamentUsers.ts";
import { FaCheck } from "react-icons/fa";
import { useToast } from "#/state/toastStore.ts";

const description =
  "Add members from the club to the tournament. Selected users will be immediately added as a participant.";

type Props = {
  tournament: Tournament;
  closeDialog: (success?: boolean) => void;
};
export default function AddTournamentParticipants({ tournament, closeDialog }: Props) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [addOrganizers, setAddOrganizers] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const { data: clubMembers } = useClubUsers(tournament.club_id);
  const { data: tournamentMembers } = useTournamentUsers(tournament.id);
  const { mutateAsync: insertUsers } = useInsertTournamentUsers();
  const { showToast } = useToast();

  const remainingUsers = React.useMemo(() => {
    const tournamentMemberIds = (tournamentMembers ?? []).map((member) => member.id);
    return (clubMembers ?? []).filter((member) => {
      return member.userData?.id && !tournamentMemberIds.includes(member.userData.id);
    });
  }, [clubMembers, tournamentMembers]);

  const toggleUser = React.useCallback((userId: string | null | undefined) => {
    if (!userId) return;
    if (selectedIds.includes(userId)) {
      setSelectedIds(selectedIds.filter((id) => id !== userId));
    } else {
      setSelectedIds([...selectedIds, userId]);
    }
  }, [selectedIds]);

  const toggleOrganizer = React.useCallback(
    (userId: string | null | undefined) => {
      if (!userId) return;
      if (addOrganizers.includes(userId)) {
        setAddOrganizers(addOrganizers.filter(id => id !== userId));
      } else {
        setAddOrganizers([...addOrganizers, userId]);
      }
    },
    [addOrganizers],
  );

  const handleSubmit = React.useCallback(async () => {
    const userIds = [...selectedIds];
    setIsSubmitting(true);
    try {
      const submitData = userIds.map((userId) => {
        const asOrganizer = addOrganizers.includes(userId);
        return { user_id: userId, tournament_id: tournament.id, is_owner: asOrganizer };
      })
      const response = await insertUsers(submitData);
      if (!response?.length) {
        throw new Error("Invalid response from insert tournament users");
      }
      showToast({
        title: "Users added!",
        message: "The users have been added as participants in this tournament.",
        type: "success",
      });
      closeDialog(true);
    } catch (error) {
      console.error(error);
      showToast({
        title: "An error occurred",
        message: "Sorry, the users could not be added",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [addOrganizers, closeDialog, insertUsers, selectedIds, showToast, tournament.id])

  return (
    <div className="column w-full gap-4">
      <p className="text-sm text-dark">{description}</p>

      {!!remainingUsers?.length && (
        <div className="row w-full gap-2 items-center flex-wrap">
          {remainingUsers.map(user => {
            const isSelected = !!user.userData?.id && selectedIds.includes(user.userData.id);
            const asOrganizer = !!user.userData?.id && isSelected && addOrganizers.includes(user.userData.id);
            return (
              <div
                key={user.id}
                className="relative row w-12 h-12 justify-center items-center cursor-pointer"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleUser(user.userData?.id);
                }}>
                <TTTooltip
                  label={user?.userData?.name ?? "Unnamed User"}
                  delay={30}>
                  <ProfilePhoto
                    user={user.userData}
                    size={40}
                    fontSize={16}
                    className="rounded-full bg-surface border"
                  />
                </TTTooltip>

                {isSelected && (
                  <TTTooltip label="Add as Organizer" delay={30}>
                    <div
                      className="absolute row top-0 right-0 w-5 h-5 justify-center items-center rounded-full border border-primary bg-surface cursor-pointer z-2"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleOrganizer(user.userData?.id);
                      }}>
                      {asOrganizer && (
                        <FaCheck
                          size={11}
                          className="w-2.75 h-2.75 text-primary"
                        />
                      )}
                    </div>
                  </TTTooltip>
                )}

                <div className="absolute row top-0 left-0 w-12 h-12 justify-center items-center select-none pointer-events-none z-1">
                  <div
                    className="border-2 border-primary rounded-full"
                    style={{
                      transitionProperty: "width, height, opacity",
                      transitionDuration: "150ms, 150ms, 120ms",
                      transitionTimingFunction: "ease",
                      width: isSelected ? "48px" : "0",
                      height: isSelected ? "48px" : "0",
                      opacity: isSelected ? 1 : 0,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!remainingUsers?.length && (
        <div className="row w-full h-16 justify-center items-center">
          <p className="text-sm text-gray-400 font-medium text-center">
            All club users are added
          </p>
        </div>
      )}

      <div className="row w-full justify-end items-end gap-2 mt-4">
        <TTButton
          className="px-2 min-h-10"
          buttonStyle="outline"
          disabled={isSubmitting}
          onClick={() => closeDialog()}>
          Cancel
        </TTButton>

        <TTButton
          className="px-2 min-h-10"
          buttonStyle="primary"
          disabled={!selectedIds.length || isSubmitting}
          tooltip={
            !selectedIds.length
              ? "Select at least one user"
              : "Add selected"
          }
          onClick={() => handleSubmit()}>
          Add
        </TTButton>
      </div>
    </div>
  );
}