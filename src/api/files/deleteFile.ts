import { supabase } from "#/integrations/supabase/supabase.ts";
import { useMutation } from "@tanstack/react-query";

type DeleteData = {
  urls: string | string[];
  bucket?: string | undefined;
};
async function deleteFileFn({ urls, bucket }: DeleteData) {
  const pathRegex = new RegExp(`(?<=/public/${bucket ?? "user_data/"}).+`);
  const paths = (Array.isArray(urls) ? urls : [urls])
    .map(url => url.match(pathRegex)?.[0])
    .filter(path => !!path) as string[];
  const { data, error } = await supabase.storage
    .from("user_data")
    .remove(paths);
  if (error) {
    console.error("Error deleting file. ", error, paths);
    return;
  }
  return data;
}

export function useDeleteFile() {
  return useMutation({
    mutationFn: (data: DeleteData) => deleteFileFn(data),
  });
}
