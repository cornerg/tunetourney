import { imageTypeRegex } from "#/utils/filetypes.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useMutation } from "@tanstack/react-query";

type UploadData = {
  tag: string;
  url: string;
};
async function uploadFileFn({ tag, url }: UploadData) {
  try {
    const blob = await fetch(url).then(r => r.blob());
    const name = `${tag}-${crypto.randomUUID()}.${blob.type.match(imageTypeRegex)?.[0]}`;
    const file = new File([blob], name, { type: blob.type });
    const { data, error } = await supabase.storage
      .from("user_data")
      .upload(name, file, { upsert: true });
    console.log("Upload response data: ", data);
    if (error) {
      console.error("Error uploading file. ", error, name, file);
      return;
    }
    const uploadedData = supabase.storage
      .from("user_data")
      .getPublicUrl(data?.path);
    return uploadedData?.data?.publicUrl ?? "";
  } catch (error) {
    console.error("Error uploading file. ", error);
  }
}

export function useUploadFile() {
  return useMutation({
    mutationFn: (data: UploadData) => uploadFileFn(data),
  });
}
