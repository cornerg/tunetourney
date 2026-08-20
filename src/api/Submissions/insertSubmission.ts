import type { Submission } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

async function insertSubmissionFn(newEntry: Partial<Submission>) {
  const { data, error } = await supabase
    .from("Submissions")
    .insert([{ ...newEntry }])
    .select();
  if (error) {
    console.error("Error adding submission", error);
    return null;
  }
  return data?.[0] as Submission | undefined;
}

export function useInsertSubmission() {
  const userId = useCurrentUserId();
  return useMutation({
    mutationFn: (submission: Partial<Submission>) =>
      insertSubmissionFn(submission),
    onSuccess: (newEntry, _variables, _onMutateResult, context) => {
      const roundId = newEntry?.round_id ?? "";
      const queryKey = ["submissions", userId, roundId];
      context.client.setQueryData(queryKey, (old: Submission[]) => {
        if (newEntry?.id) {
          if (Array.isArray(old)) return [...old, newEntry];
          return [newEntry];
        }
      });
      void context.client.invalidateQueries({ queryKey });
    },
  });
}
