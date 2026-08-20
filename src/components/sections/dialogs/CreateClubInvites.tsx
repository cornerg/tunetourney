import React from "react";
import TTButton from "#/components/primitives/TTButton.tsx";
import TTInput from "#/components/primitives/TTInput.tsx";
import TTSelect from "#/components/primitives/TTSelect.tsx";
import type { Club } from "#/models/supabaseTables.ts";
import { cn } from "#/utils/utils.ts";
import { MdAdd, MdClose } from "react-icons/md";
import { useInsertNotifications } from "#/api/Notifications/insertNotifications.ts";
import { useToast } from "#/state/toastStore.ts";
import { useClubIdentities } from "#/api/ClubUsers/fetchClubIdentities.ts";
import type { InsertNotificationInput } from "#/models/supabaseUtils.ts";

const description = "Send invitations to one or more Tune Tourney users to join this club. If the users exist, they'll be notified and given the choice to accept or decline.";

type InviteRow = {
  identity: string;
  isOwner: boolean;
}

type Props = {
  club: Club;
  closeDialog: (success?: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>
export default function CreateClubInvites({
  club,
  closeDialog,
  className,
  ...props
}: Props) {
  const [invites, setInvites] = React.useState<InviteRow[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [isOwnerMode, setIsOwnerMode] = React.useState<boolean>(false);
  const [identityError, setIdentityError] = React.useState<string>("");
  const [isSending, setIsSending] = React.useState<boolean>(false);

  const { data: memberIdentities } = useClubIdentities(club.id);
  const { mutateAsync: insertNotifications } = useInsertNotifications();
  const { showToast } = useToast();

  const handleToggleMode = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setIsOwnerMode(event.target.value === "owner");
    },
    [],
  );

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (identityError) setIdentityError("");
      setInputValue(event.target.value);
    },
    [identityError],
  );

  const handleAddRow = React.useCallback(() => {
    const identity = inputValue;
    const existingMember = memberIdentities?.find((user) => {
      return user.id === identity || user.name === identity || user.email === identity;
    });
    if (existingMember) {
      setIdentityError("This user is already a member.");
      return;
    }
    const existingInvite = invites.find(row => row.identity === inputValue);
    if (existingInvite) {
      setIdentityError("This identity is already added.");
      return;
    }
    const newInvite = { identity: inputValue, isOwner: isOwnerMode };
    setInvites([...invites, newInvite]);
    setInputValue("");
  }, [inputValue, invites, isOwnerMode, memberIdentities]);

  const handleRemoveRow = React.useCallback(
    (identity: string) => {
      setInvites(invites.filter(row => row.identity !== identity));
    },
    [invites],
  );

  const handleSubmit = React.useCallback(async (sendInvites: InviteRow[]) => {
    setIsSending(true);
    try {
      const inputs: InsertNotificationInput[] = [];
      for (const invite of sendInvites) {
        inputs.push({
          identity: invite.identity,
          title: "Invited to Club",
          description: `You've been invited to join ${club.title} as ${invite.isOwner ? "an owner" : "a member"}.`,
          type: "invited-to-club",
          metadata: {
            club_id: club.id,
            is_owner: invite.isOwner,
          }
        })
      }
      const result = await insertNotifications(inputs);
      if (!result) {
        throw new Error("Failed to create notifications");
      }
      const isSingle = inputs.length === 1;
      showToast({
        title: `Invite${isSingle ? "" : "s"} Sent!`,
        message: `If the user${isSingle ? "" : "s"} exist${isSingle ? "s" : ""}, they will be notified.`,
        type: "success",
      });
      closeDialog(true);
    } catch (error) {
      console.error(error);
      showToast({
        title: "An error occurred",
        message: "Sorry, your notifications could not be sent",
        type: "error",
      })
    } finally {
      setIsSending(false);
    }
  }, [closeDialog, club.id, club.title, insertNotifications, showToast]);

  return (
    <div className={cn("column w-full gap-4")} {...props}>
      <p className="text-sm text-dark">{description}</p>

      <div className="column w-full flex-1 gap-1">
        <div className="row w-full items-end gap-2">
          <TTInput
            className="w-full flex-1 h-10"
            label="Identity (email or username)"
            value={inputValue}
            onChange={handleInputChange}
          />

          <TTSelect
            className="w-full max-w-24 flex-1 h-10"
            label="Invite As"
            value={isOwnerMode ? "owner" : "member"}
            onChange={handleToggleMode}>
            <option value="owner">Owner</option>
            <option value="member">Member</option>
          </TTSelect>

          <TTButton
            className="group w-10 h-10"
            buttonStyle="outline"
            disabled={!inputValue || !!identityError}
            tooltip="Add to list"
            onClick={handleAddRow}>
            <MdAdd
              size={22}
              className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors"
            />
          </TTButton>
        </div>

        {!!identityError && (
          <p className="w-full flex-1 px-1.5 py-0.5 bg-red-600/10 text-red-700 text-sm rounded-lg">
            {identityError}
          </p>
        )}
      </div>

      {invites.length > 0 && (
        <div className="column w-full gap-0 max-h-48 overflow-y-auto">
          <div className="row w-full px-2 pb-1 gap-2 border-b border-b-gray-400">
            <p className="text-dark font-semibold w-full flex-1">Identity</p>
            <p className="text-dark font-semibold w-full flex-1 text-end">
              Type
            </p>
            <div className="w-4.5 h-4.5 ml-2" />
          </div>

          {invites.map((invite, i) => {
            return (
              <div
                key={`invite-${i}`}
                className="group row w-full items-center px-2 py-1 gap-2 border-b border-b-gray-400/30 cursor-pointer bg-surface hover:bg-background transition-colors"
                onClick={() => handleRemoveRow(invite.identity)}>
                <p className="text-dark w-full flex-1">{invite.identity}</p>
                <p className="text-dark w-full flex-1 text-end">
                  {invite.isOwner ? "Owner" : "Member"}
                </p>
                <MdClose
                  size={18}
                  className="w-4.5 h-4.5 text-gray-600 ml-2 group-hover:text-red-600 transition-colors"
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="row w-full justify-end items-end gap-2 mt-4">
        <TTButton
          className="px-2 min-h-10"
          buttonStyle="outline"
          disabled={isSending}
          onClick={() => closeDialog()}>
          Cancel
        </TTButton>

        <TTButton
          className="px-2 min-h-10"
          buttonStyle="primary"
          disabled={!invites.length || isSending}
          tooltip={
            !invites.length
              ? "Please add at least one invite"
              : "Send invite(s)"
          }
          onClick={() => handleSubmit(invites)}>
          Send
        </TTButton>
      </div>
    </div>
  );
}
