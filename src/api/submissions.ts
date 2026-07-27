import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentUserId } from "#/api/sessions.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Submission } from "#/models/supabaseTables.ts";

const oneHour = 1000 * 60 * 60;

async function fetchSubmissions(roundid: string | null | undefined) {
  if (!roundid) return [];
  const { data, error } = await supabase.rpc("get_round_submissions", {
    roundid,
  });
  if (error) {
    console.error("Error fetching submissions: ", error);
    return [];
  }
  if (Array.isArray(data)) {
    return data as Submission[];
  }
  return [];
}

export function useSubmissions(roundId: string | null | undefined) {
  const userId = useCurrentUserId();
  return useQuery({
    queryKey: ["submissions", userId, roundId],
    queryFn: () => fetchSubmissions(roundId),
    staleTime: oneHour,
  });
}

// Create a submission
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
      context.client.invalidateQueries({ queryKey });
    },
  });
}

// Update a submission
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

interface InsertParams extends Partial<Omit<Submission, "id">> {
  id: string;
}
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
      context.client.invalidateQueries({ queryKey });
    },
  });
}
