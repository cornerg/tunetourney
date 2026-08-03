import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useInsertClub, useUpdateClub } from "#/api/clubs.ts";
import { useFileDelete, useFileUpload } from "#/api/files.ts";
import TTButton from "#/components/primitives/TTButton";
import TTInput from "#/components/primitives/TTInput.tsx";
import { getGradient, useBreakpoints } from "#/hooks/utils.ts";
import type { Club } from "#/models/supabaseTables.ts";
import { imageTypeRegex } from "#/utils/filetypes.ts";
import { cn } from "#/utils/utils.ts";
import { FaRegImage } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { LuSave } from "react-icons/lu";
import { useTTToast } from "#/components/primitives/TTToast.tsx";

const now = Date.now();

type Props = {
  sourceClub?: Club | null | undefined;
  setEdit: (newState: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>
export default function ClubEdit({ sourceClub, setEdit, className }: Props) {
  const [localClub, setLocalClub] = React.useState<Partial<Club>>({});
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const { title, logo, banner, description } = React.useMemo(
    () => localClub,
    [localClub],
  );
  const { mutateAsync: insertClub } = useInsertClub();
  const { mutateAsync: updateClub } = useUpdateClub();
  const { mutateAsync: uploadFile } = useFileUpload();
  const { mutateAsync: deleteFile } = useFileDelete();

  const { isMobile } = useBreakpoints();
  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { TTToast, toast } = useTTToast();

  // When source data changes, sync local data with source data
  React.useEffect(() => {
    if (localClub.id !== (sourceClub?.id ?? "")) {
      setLocalClub({ ...sourceClub });
    }
  }, [localClub, sourceClub]);

  const gradient = React.useMemo(() => {
    const seed = parseInt(
      new Date(localClub?.created_at ?? now)
        .getTime()
        .toString()
        .slice(-1),
    );
    return getGradient(seed);
  }, [localClub]);

  const editLocal = React.useCallback(
    (newData: Partial<Club>) => {
      setLocalClub({ ...localClub, ...newData });
    },
    [localClub],
  );

  const handleClickBannerUploader = React.useCallback(
    () => bannerInputRef.current?.click(),
    [],
  );
  const handleBanner = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const validFiletype = file.type.match(imageTypeRegex)?.[0];
        if (validFiletype) {
          editLocal({ banner: URL.createObjectURL(file) });
        } else {
          console.error("Invalid file type"); // ToDo: add toast
        }
      }
    },
    [editLocal],
  );

  const handleClickLogoUploader = React.useCallback(
    () => logoInputRef.current?.click(),
    [],
  );
  const handleLogo = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const validFiletype = file.type.match(imageTypeRegex)?.[0];
        if (validFiletype) {
          editLocal({ logo: URL.createObjectURL(file) });
        }
      }
    },
    [editLocal],
  );

  const handleCancel = React.useCallback(async () => {
    if (sourceClub?.id) {
      setEdit(false);
    } else {
      await navigate({ to: "/clubs" });
    }
  }, [sourceClub?.id, setEdit, navigate]);

  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    const saveId = sourceClub?.id;
    const saveData = { ...localClub };

    // Iterate through properties to remove unchanged fields
    for (const key of Object.keys(saveData) as (keyof Club)[]) {
      if (
        !!sourceClub?.[key] &&
        sourceClub?.[key] === saveData[key] &&
        key !== "id"
      )
        delete saveData[key];
    }
    if (!Object.keys(saveData).length) {
      console.error("No changes to save"); // ToDo: add toast
      return;
    }

    let response: Club | null | undefined;
    try {
      const toDelete: string[] = []; // Store a list of files that are being replaced.

      // Upload new files to storage
      if (saveData?.logo) {
        const newLogoUrl = await uploadFile({
          url: saveData.logo,
          tag: "logo",
        });
        if (newLogoUrl) {
          saveData.logo = newLogoUrl;
          if (sourceClub?.logo) {
            toDelete.push(sourceClub?.logo);
          }
        }
      }
      if (saveData?.banner) {
        const newBannerUrl = await uploadFile({
          url: saveData.banner,
          tag: "banner",
        });
        if (newBannerUrl) {
          saveData.banner = newBannerUrl;
          if (sourceClub?.banner) {
            toDelete.push(sourceClub?.banner);
          }
        }
      }

      // Save club
      if (saveId) {
        response = await updateClub({ id: saveId, ...saveData });
      } else {
        response = await insertClub({ ...saveData });
      }
      if (!response?.id) {
        throw new Error("Invalid mutation response");
      } else {
        // Data safely saved; if files were replaced, delete the old files
        if (toDelete.length > 0) {
          const deletedFiles = await deleteFile({ urls: toDelete });
          console.log(deletedFiles);
        }

        toast({
          title: "Round Saved",
          message: "The round status has been updated.",
          type: "success",
        });
        if (saveId) {
          setEdit(false);
        } else {
          await navigate({
            to: "/club/$clubId",
            params: { clubId: response?.id },
          });
        }
      }
    } catch (error) {
      console.error("An error occurred saving Club: ", error); // ToDo: add toast
    } finally {
      setIsSaving(false);
    }
  }, [sourceClub, localClub, uploadFile, updateClub, insertClub, toast, deleteFile, setEdit, navigate]);

  return (
    <div className={cn("column w-full", className)}>
      <div className="relative row w-full h-64 justify-center gap-1 bg-cover bg-center">
        <div
          className="row w-full h-full justify-center items-center bg-cover bg-center"
          style={
            banner
              ? { backgroundImage: `url(${banner})` }
              : {
                  background: `linear-gradient(45deg, ${gradient.start}, ${gradient.end})`,
                }
          }>
          <input
            ref={bannerInputRef}
            type="file"
            onChange={handleBanner}
            hidden
          />
          <div
            className="group row w-full h-full justify-center items-center cursor-pointer"
            onClick={handleClickBannerUploader}>
            <div className="column w-full max-w-3xs h-full max-h-16 justify-center items-center gap-0 backdrop-blur-xs group-hover:backdrop-blur-sm rounded-lg border border-primary/30 group-hover:border-primary bg-primary/10 group-hover:bg-primary/30 transition-all">
              <div className="row w-full h-max justify-center items-center gap-4">
                <FaRegImage
                  size={32}
                  className="w-8 h-8 text-white/50 group-hover:text-white transition-colors"
                />
                <p className="text-lg text-white/50 group-hover:text-white transition-colors">
                  Upload banner
                </p>
              </div>

              <p className="text-xs text-white/50 group-hover:text-white transition-colors">
                Allowed types: .jpg, .png, .gif, .webp
              </p>
            </div>
          </div>
        </div>

        <div className="absolute row top-2 right-2 w-max gap-1">
          <TTButton
            buttonStyle="outline"
            className="w-8 h-8"
            tooltip="Save"
            disabled={isSaving}>
            <LuSave size={22} onClick={handleSave} />
          </TTButton>

          <TTButton
            buttonStyle="outline"
            className="w-8 h-8"
            tooltip="Cancel"
            disabled={isSaving}>
            <IoCloseSharp size={22} onClick={handleCancel} />
          </TTButton>
        </div>
      </div>

      <div
        className={cn("column w-full gap-4 pb-6", {
          "px-8": !isMobile,
          "px-4": isMobile,
        })}>
        <div className="row w-full h-27.5 items-end gap-4 -mt-13.75">
          <div
            className="row w-27.5 h-27.5 rounded-2xl border border-gray-400 bg-contain bg-center shadow-[1px_-2px_8px_0px] shadow-black/50 overflow-hidden z-2"
            style={
              logo
                ? { backgroundImage: `url(${logo})` }
                : {
                    background: `linear-gradient(45deg, ${gradient.start}, ${gradient.end})`,
                  }
            }>
            <input
              ref={logoInputRef}
              type="file"
              onChange={handleLogo}
              hidden
            />
            <div
              className="group column w-full h-full justify-center items-center bg-primary/0 hover:bg-primary-20 backdrop-blur-[0] hover:backdrop-blur-sm transition-all cursor-pointer"
              onClick={handleClickLogoUploader}>
              <FaRegImage
                size={32}
                className="w-8 h-8 text-white/50 group-hover:text-white transition-colors"
              />
              <p className="text-xs text-center text-white/50 group-hover:text-white transition-colors">
                Upload Logo
              </p>
            </div>
          </div>

          <div className="row h-27.5 w-full flex-1 pt-13.75 items-center">
            <TTInput
              className="w-full max-w-96 h-10"
              inputClassName="text-xl"
              label="Title"
              value={title ?? ""}
              onChange={e => editLocal({ title: e.target.value })}
            />
          </div>
        </div>

        <TTInput
          className="w-full h-10"
          label="Description"
          value={description ?? ""}
          onChange={e => editLocal({ description: e.target.value })}
        />
      </div>

      <TTToast />
    </div>
  );
}
