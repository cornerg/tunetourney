import type { Round } from "#/models/supabaseTables.ts";
import  { useTTToast } from "#/components/primitives/TTToast.tsx";
import { useInsertRound, useUpdateRound } from "#/api/rounds.ts";
import React from "react";

export function useSaveRound() {
  const { mutateAsync: insertRound } = useInsertRound();
  const { mutateAsync: updateRound } = useUpdateRound();
  const { toast } = useTTToast();

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
      toast({
        title: "Round saved",
        message: `The round has been successfully ${data?.id ? "updated" : "created"}.`,
        type: "success",
      });
      success = true;

    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        message: "Your round could not be saved.",
        type: "error",
      });
    }

    return { success, response };
  }, [insertRound, toast, updateRound]);

  return { save: saveRound };
}
