import React from "react";
import {cn} from "#/utils/utils.ts";

interface Props extends React.HTMLProps<HTMLInputElement> {
  background?: "surface" | "background";
  inputClassName?: string | undefined;
  inputStyle?: React.CSSProperties | undefined;
  error?: string | undefined;
}
export default function TTInput({ label, className, style, background = "surface", error, onFocus, onBlur, ...props }: Props) {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  return (
    <div
      className={cn(
        "row relative mt-2 rounded-lg border-1 border-dark",
        {
          "border-primary": isFocused && !error,
          "border-red-700": !!error,
        },
        className
      )}
      style={{ transition: "border-color 150ms ease", ...style }}
    >
      {label && (
        <p className={cn(
          `absolute text-xs z-[2] top-[-8px] left-2 px-1 bg-${background}`,
          {
            "text-primary": isFocused && !error,
            "text-dark": !isFocused && !error,
            "text-red-700": !!error,
          }
        )}
           style={{ transition: "color 150ms ease" }}
        >
          {label}
        </p>
      )}

      {error && (
        <p
          className={`absolute text-xs text-right text-red-700 z-[2] bottom-[-8px] right-2 px-1 bg-${background}`}
          style={{ transition: "color 150ms ease" }}
        >
          {error}
        </p>
      )}

      <input
        className={`absolute w-full h-full top-0 left-0 py-1 px-2 text-sm text-dark bg-${background} border-0 outline-0 rounded-lg z-[1]`}
        onFocus={(e) => {
          if (onFocus) onFocus(e);
          setIsFocused(true)
        }}
        onBlur={(e) => {
          if (onBlur) onBlur(e);
          setIsFocused(false)
        }}
        {...props}
      />
    </div>
  )
}
