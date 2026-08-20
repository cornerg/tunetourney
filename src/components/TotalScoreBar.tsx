import { cn } from "#/utils/utils.ts";
import React from "react";

type Props = {
  min: number;
  max: number;
  limit: number;
  value: number;
}
export default function TotalScoreBar({ min, max, limit, value }: Props) {
  const isValueInRange = React.useMemo(() => {
    return value >= min && value <= max;
  }, [value, min, max]);

  return (
    <div className="relative row w-full h-6 rounded-full bg-surface border border-gray-300">
      <div
        className={cn(
          "row h-full justify-between items-center border-x-2 border-dotted transition-colors",
          {
            "bg-emerald-400/40": isValueInRange,
            "bg-rose-400/40": !isValueInRange,
          }
        )}
        style={{
          width: `${Math.round(((max - min) / limit) * 100)}%`,
          marginLeft: `${Math.round((min / limit) * 100)}%`,
        }}>
        <p className="w-8 font-bold text-center text-dark -ml-8">
          {min}
        </p>
        <p className="w-8 font-bold text-center text-dark -mr-8">
          {max}
        </p>
      </div>

      <div
        className="absolute h-full select-none mx-0.75"
        style={{ width: "calc(100% - 6px)" }}>
        <div className="relative w-full h-full select-none">
          <div
            className="absolute column w-6 bottom-3"
            style={{
              left: `calc(${Math.round((value / limit) * 100)}% - 12px)`,
              transition: "left 150ms ease-out",
            }}>
            <div className="w-6 h-4 bg-primary rounded-t-lg z-2">
              <p className="font-bold text-sm text-surface w-full text-center">
                {value}
              </p>
            </div>
            <div
              className="w-0 h-0 border-primary z-1"
              style={{
                borderTopWidth: "12px",
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
