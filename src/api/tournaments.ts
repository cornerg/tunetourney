import {supabase} from "#/integrations/supabase/supabase.ts";
import {useQuery} from "@tanstack/react-query";
import type {Tournament} from "#/models/supabaseTables.ts";
import {useSessionToken} from "#/api/sessions.ts";

const oneHour = 1000 * 60 * 60;

async function fetchTournaments() {
  const { data, error } = await supabase.from('Tournaments').select('*');
  console.log("Tournaments data: ", data);
  if (error) {
    console.error("Error fetching tournaments. ", error);
    return [];
  }
  return data as Tournament[];
}

export function useTournaments() {
  const userToken = useSessionToken();
  return useQuery({ queryKey: ["tournaments", userToken], queryFn: fetchTournaments, staleTime: oneHour });
}