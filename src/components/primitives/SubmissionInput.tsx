import TTInput from "#/components/primitives/TTInput.tsx";
import React from "react";
import type { SupportedPlatformKey } from "#/models/SupportedPlatforms.ts";
import { MdErrorOutline } from "react-icons/md";
import { FaSpotify, FaYoutube } from "react-icons/fa6";

type Props = {
  platform: SupportedPlatformKey | undefined;
  sourceValue?: string | undefined;
  error?: string | undefined;
  disabled?: boolean;
  handleUrl: (value: string) => void;
}
export default function SubmissionInput({ platform, sourceValue, error, disabled, handleUrl }: Props) {
  const [value, setValue] = React.useState<string>("");

  const urlChangeTimeout = React.useRef<NodeJS.Timeout | number>(-1);

  const fieldLabel = React.useMemo(() => {
    switch (platform) {
      case "youtube":
        return "YouTube Video URL";
      case "spotify":
        return "Spotify Track URL";
      default:
        return "Submission URL";
    }
  }, [platform]);

  const platformIcon = React.useCallback(() => {
    if (error) {
      return <MdErrorOutline size={22} className="w-5.5 h-5.5 text-red-800" />;
    } else if (platform === "youtube") {
      return <FaYoutube size={32} className="w-8 h-8 text-[#ff0033]" />;
    } else if (platform === "spotify") {
      return <FaSpotify size={32} className="w-8 h-8 text-[#1ed760]" />;
    }
  }, [error, platform]);
  console.log("Error and platform: ", error, platform);
  React.useEffect(() => {
    setValue(sourceValue ?? "");
  }, [sourceValue]);

  // If the input is deselected, cancel the change confirmation timer and handle it right away
  const handleUrlBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (urlChangeTimeout.current) {
        clearTimeout(urlChangeTimeout.current);
        urlChangeTimeout.current = -1;
      }
      handleUrl(event.target.value);
      event.currentTarget.blur();
    },
    [handleUrl],
  );

  // Whenever the entered value of the URL input changes, set a timer. If the value isn't changed in that time, the value will be handled
  const handleUrlChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      if (urlChangeTimeout.current) {
        clearTimeout(urlChangeTimeout.current);
      }
      urlChangeTimeout.current = setTimeout(() => {
        handleUrl(event.target.value);
        urlChangeTimeout.current = -1;
      }, 3000);
    },
    [handleUrl],
  );

  return (
    <div className="relative row w-full">
      <TTInput
        className="w-full h-10"
        label={fieldLabel}
        value={value}
        error={error}
        disabled={disabled}
        onChange={handleUrlChange}
        onBlur={handleUrlBlur}
      />

      <div className="absolute row top-2 right-1 h-10 w-10 justify-center items-center z-2">
        {platformIcon()}
      </div>
    </div>
  );
}