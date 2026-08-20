import type { Submission } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

async function updateSubmissionFn(id: string, submission: Partial<Submission>) {
  const { data, error } = await supabase
    .from("Submissions")
    .update({ ...submission })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating submission", error);
    return null;
  }
  return data?.[0] as Submission | undefined;
}

type InsertParams = {
  id: string;
} & Partial<Omit<Submission, "id">>;
export function useUpdateSubmission() {
  const userId = useCurrentUserId();
  return useMutation({
    mutationFn: ({ id, ...submission }: InsertParams) =>
      updateSubmissionFn(id, submission),
    onSuccess: (newEntry, variables, _onMutateResult, context) => {
      const roundId = newEntry?.round_id ?? "";
      const queryKey = ["submissions", userId, roundId];
      context.client.setQueryData(queryKey, (old: Submission[]) => {
        const oldEntry = old?.find(row => row.id === variables.id);
        if (oldEntry?.id && newEntry?.id) {
          const otherEntries = old.filter(row => row.id !== variables.id);
          return [...otherEntries, newEntry];
        }
      });
      void context.client.invalidateQueries({ queryKey });
    },
  });
}
