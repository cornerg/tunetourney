import { useMutation } from "@tanstack/react-query";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { imageTypeRegex } from "#/utils/filetypes.ts";

interface uploadData {
  tag: string;
  url: string;
}
async function fileUploadFn({ tag, url }: uploadData) {
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
export function useFileUpload() {
  return useMutation({
    mutationFn: (data: uploadData) => fileUploadFn(data),
  });
}

interface deleteData {
  urls: string | string[];
  bucket?: string | undefined;
}
async function fileDeleteFn({ urls, bucket }: deleteData) {
  const pathRegex = new RegExp(`(?<=/public/${bucket ?? "user_data/"}).+`);
  const paths = (Array.isArray(urls) ? urls : [urls])
    .map(url => url.match(pathRegex)?.[0])
    .filter(path => !!path) as string[];
  const { data, error } = await supabase.storage
    .from("user_data")
    .remove(paths);
  if (error) {
    console.error("Error uploading file. ", error, paths);
    return;
  }
  return data;
}
export function useFileDelete() {
  return useMutation({
    mutationFn: (data: deleteData) => fileDeleteFn(data),
  });
}
