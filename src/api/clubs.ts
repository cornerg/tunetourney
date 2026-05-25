import {supabase} from "#/integrations/supabase/supabase.ts";
import {useQuery} from "@tanstack/react-query";
import type {Club, ClubUser} from "#/models/supabaseTables.ts";
import {useSessionToken} from "#/api/sessions.ts";

const oneHour = 1000 * 60 * 60;

async function fetchClubs() {
  const { data, error } = await supabase.from('Clubs').select('*');
  console.log("Clubs data: ", data);
  if (error) {
    console.error("Error fetching clubs. ", error);
    return [];
  }
  return data as Club[];
}

export function useClubs() {
  const userToken = useSessionToken();
  return useQuery({ queryKey: ["clubs", userToken], queryFn: fetchClubs, staleTime: oneHour });
}

async function fetchClubUsers(clubIds: string | string[] | null | undefined) {
  if (!clubIds?.length) return [];
  const clubIdList = Array.isArray(clubIds) ? clubIds : [clubIds];
  const { data, error } = await supabase.from('ClubUsers').select('*, Users ( avatar )').in('id', clubIdList);
  console.log("Club Users data: ", data);
  if (error) {
    console.error("Error fetching club users. ", error);
    return [];
  }
  return data as ClubUser[];
}

export function useClubUsers(clubIds: string | string[] | null | undefined) {
  const userToken = useSessionToken();
  return useQuery({ queryKey: ["clubUsers", userToken, clubIds], queryFn: () => fetchClubUsers(clubIds), staleTime: oneHour });
}