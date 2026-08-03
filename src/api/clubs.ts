import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentUserId } from "#/api/sessions.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Club, ClubUser, User } from "#/models/supabaseTables.ts";

const oneHour = 1000 * 60 * 60;

export type ClubUserWithData = {
  userData?: User;
} & ClubUser

async function fetchClubs() {
  const { data, error } = await supabase.from("Clubs").select("*");
  if (error) {
    console.error("Error fetching clubs. ", error);
    return [];
  }
  return data as Club[];
}

export function useClubs() {
  const currentUserId = useCurrentUserId();
  return useQuery({
    queryKey: ["clubs", currentUserId],
    queryFn: fetchClubs,
    staleTime: oneHour,
  });
}

async function fetchClubUsers(clubIds: string | string[] | null | undefined) {
  if (!clubIds?.length) return [];
  const clubIdList = Array.isArray(clubIds) ? clubIds : [clubIds];
  const { data, error } = await supabase
    .from("ClubUsers")
    .select("*, userData:Users ( * )")
    .in("club_id", clubIdList);
  if (error) {
    console.error("Error fetching club users. ", error);
    return [];
  }
  return data as ClubUserWithData[];
}

export function useClubUsers(clubIds: string | string[] | null | undefined) {
  const currentUserId = useCurrentUserId();
  return useQuery({
    queryKey: ["clubUsers", currentUserId, clubIds],
    queryFn: () => fetchClubUsers(clubIds),
    staleTime: oneHour,
  });
}

// Create a Club
async function insertClubFn(newEntry: Partial<Club>) {
  const { data, error } = await supabase
    .from("Clubs")
    .insert([{ ...newEntry }])
    .select();
  if (error) {
    console.error("Error adding Club", error);
    return null;
  }
  return data?.[0] as Club | undefined;
}

export function useInsertClub() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (data: Partial<Club>) => insertClubFn(data),
    onSuccess: (newEntry, _variables, _onMutateResult, context) => {
      const queryKey = ["clubs", currentUserId];
      void context.client.setQueryData(queryKey, (old: Club[]) => {
        if (newEntry?.id) {
          if (Array.isArray(old)) return [...old, newEntry];
          return [newEntry];
        }
      });
      void context.client.invalidateQueries({ queryKey });
    },
  });
}

// Update a submission
async function updateClubFn(id: string, club: Partial<Club>) {
  const { data, error } = await supabase
    .from("Clubs")
    .update({ ...club })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating Club", error);
    return null;
  }
  return data?.[0] as Club | undefined;
}

type InsertParams = {
  id: string;
} & Partial<Omit<Club, "id">>
export function useUpdateClub() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: ({ id, ...club }: InsertParams) => updateClubFn(id, club),
    onSuccess: (newEntry, _variables, _onMutateResult, context) => {
      const queryKey = ["clubs", currentUserId];
      context.client.setQueryData(queryKey, (cachedList: Club[]) => {
        if (newEntry?.id) {
          const otherEntries = cachedList.filter(row => row.id !== newEntry.id);
          return [...otherEntries, newEntry];
        }
      });
      void context.client.invalidateQueries({ queryKey });
    },
  });
}
