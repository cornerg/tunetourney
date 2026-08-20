import React from "react";
import { cn } from "#/utils/utils.ts";

import "@/styles/ScoreSlider.css";

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Props = {
  value: number | undefined;
  setValue: (value: number) => void;
} & React.HTMLAttributes<HTMLDivElement>
export default function ScoreSlider({
  value,
  setValue,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn("relative row h-10 py-1 gap-0", className)}
      style={{
        width: "calc(110% - 40px)",
        marginLeft: "calc(-5% + 20px)",
        marginRight: "calc(-5% + 20px)",
      }}
      {...props}>
      <div className="absolute w-[90%] h-0.5 top-4.75 mx-[5%] bg-gray-500 rounded-sm z-1" />

      {NUMBERS.map(number => {
        return (
          <div
            key={`value-${number}`}
            className="group row w-full flex-1 justify-center items-center z-2 cursor-pointer"
            onClick={() => setValue(number)}>
            <p
              className={cn(
                "row w-8 h-8 p-1 justify-center items-center bg-surface border-2 border-gray-500 rounded-full font-mono text-[16px] group-hover:text-primary transition-colors",
                { "text-primary font-bold": value === number },
              )}>
              {number}
            </p>
          </div>
        );
      })}

      {typeof value === "number" && (
        <div
          className="absolute row top-0 h-10 justify-center items-center"
          style={{
            width: `${100 / Math.max(...NUMBERS)}%`,
            left: `${(value - 1) * (100 / Math.max(...NUMBERS))}%`,
            transition: "left 500ms ease",
          }}>
          <div
            className="w-10 h-10 border-2 border-primary rounded-full z-3"
            style={{ left: `${(value - 1) * (100 / Math.max(...NUMBERS))}%` }}
          />
        </div>
      )}
    </div>
  );
}
