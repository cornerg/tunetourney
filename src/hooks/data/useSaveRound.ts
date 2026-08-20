import type { Round } from "#/models/supabaseTables.ts";
import { useInsertRound } from "#/api/Rounds/insertRound.ts";
import { useUpdateRound } from "#/api/Rounds/updateRound.ts";
import React from "react";
import { useToast } from "#/state/toastStore.ts";

export function useSaveRound() {
  const { mutateAsync: insertRound } = useInsertRound();
  const { mutateAsync: updateRound } = useUpdateRound();
  const { showToast } = useToast();

  const saveRound = React.useCallback(async (data: Partial<Round>) => {
    let success = false;
    let response: Round | null | undefined = null;

    try {
      response = data?.id
        ? await updateRound({ ...data, id: data.id })
        : await insertRound(data);

      if (!response) {
        throw new Error("Invalid response");
      }
      showToast({
        title: "Round saved",
        message: `The round has been successfully ${data?.id ? "updated" : "created"}.`,
        type: "success",
      });
      success = true;

    } catch (error) {
      console.error(error);
      showToast({
        title: "An error occurred",
        message: "Your round could not be saved.",
        type: "error",
      });
    }

    return { success, response };
  }, [insertRound, showToast, updateRound]);

  return { save: saveRound };
}
