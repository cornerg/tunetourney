import React from "react";
import {cn} from "#/utils/utils.ts";

interface Props extends React.HTMLProps<HTMLInputElement> {
  background?: "surface" | "background";
  inputClassName?: string | undefined;
  inputStyle?: React.CSSProperties | undefined;
}
export default function TTInput({ label, className, style, background = "surface", ...props }: Props) {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  return (
    <div
      className={cn(
        "row relative mt-2 rounded-lg border-1 border-dark",
        {
          "border-primary": isFocused,
        },
        className
      )}
      style={{ transition: "border-color 150ms ease", ...style }}
    >
      {label && (
        <p className={cn(
          `absolute text-xs z-[2] top-[-8px] left-2 px-1 bg-${background}`,
          {
            "text-primary": isFocused,
            "text-dark": !isFocused,
          }
        )}
           style={{ transition: "color 150ms ease" }}
        >
          {label}
        </p>
      )}
      <input
        className={`absolute w-full h-full top-0 left-0 py-1 px-2 text-sm text-dark bg-${background} border-0 outline-0 rounded-lg z-[1]`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </div>
  )
}
