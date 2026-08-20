import { supabase } from "#/integrations/supabase/supabase.ts";
import type { User } from "#/models/supabaseTables.ts";
import { useMutation } from "@tanstack/react-query";

type InsertProps = {
  id: string;
  name: string | null | undefined;
  avatar: string | null | undefined;
};

async function insertUserFn({ id, name, avatar }: InsertProps) {
  const { data, error } = await supabase
    .from("Users")
    .insert([{ id, name, avatar }])
    .select();
  if (error) {
    console.error("Error creating user: ", error);
    return null;
  }
  return data[0] as User;
}

export function useInsertUser() {
  return useMutation({
    mutationFn: (params: InsertProps) => insertUserFn(params),
  });
}
