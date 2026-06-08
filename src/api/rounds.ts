import {supabase} from "#/integrations/supabase/supabase.ts";
import {useQuery} from "@tanstack/react-query";
import type {Round} from "#/models/supabaseTables.ts";
import {useSessionToken} from "#/api/sessions.ts";

const oneHour = 1000 * 60 * 60;

async function fetchRounds() {
  const { data, error } = await supabase.from('Rounds').select('*');
  console.log("Rounds data: ", data);
  if (error) {
    console.error("Error fetching rounds. ", error);
    return [];
  }
  return data as Round[];
}

export function useRounds() {
  const userToken = useSessionToken();
  return useQuery({ queryKey: ["rounds", userToken], queryFn: fetchRounds, staleTime: oneHour });
}