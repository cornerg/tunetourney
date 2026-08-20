import { supabase } from "#/integrations/supabase/supabase.ts";
import { useMutation } from "@tanstack/react-query";
import type { InsertNotificationInput } from "#/models/supabaseUtils.ts";

async function insertNotificationsFn(newEntries: InsertNotificationInput[]) {
  const { error } = await supabase.rpc("create_notifications", {
    input_rows: { data: newEntries },
  });
  if (error) {
    console.error("Error adding notifications", error);
    return null;
  }
  return true;
}

export function useInsertNotifications() {
  return useMutation({
    mutationFn: (submission: InsertNotificationInput[]) =>
      insertNotificationsFn(submission),
  });
}
