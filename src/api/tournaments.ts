import {supabase} from "#/integrations/supabase/supabase.ts";
import {useQuery} from "@tanstack/react-query";
import type {Tournament} from "#/models/supabaseTables.ts";
import {useCurrentUserId} from "#/api/sessions.ts";
import React from "react";

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
  const userToken = useCurrentUserId();
  return useQuery({ queryKey: ["tournaments", userToken], queryFn: fetchTournaments, staleTime: oneHour });
}

// Get One Tournament
export function useTournament(tournamentId: string | null | undefined) {
  const [tournament, setTournament] = React.useState<Tournament | null>(null);
  const { data: tournaments, ...otherData } = useTournaments();

  React.useEffect(() => {
    setTournament(tournaments?.find((t) => t.id === tournamentId) ?? null);
  }, [tournamentId, tournaments]);

  return { data: tournament, ...otherData };
}