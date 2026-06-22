import React from "react";
import {cn} from "#/utils/utils.ts";
import { Slider } from "radix-ui";
import "@/styles/ScoreSlider.css";

const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: number | undefined;
  setValue: (value: number) => void;
}
export default function ScoreSlider({ value, setValue, className, ...props }: Props) {
  return (
    <div className={cn("column w-full", className)} {...props}>
      <div className="row w-full gap-0">
        <Slider.Root
          className="sliderRoot relative flex items-center select-none touch-none w-full h-8"
          min={1}
          max={10}
          step={1}
          onValueChange={(values) => setValue(values[0])}
        >
          <Slider.Track className="sliderTrack relative bg-dark grow rounded-lg h-3">
            <Slider.Range className="absolute bg-primary rounded-lg h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-8 bg-primary rounded-xl cursor-pointer" aria-label="Score" />
        </Slider.Root>
      </div>

      <div className="row w-full flex-nowrap min-w-max px-2">
        <div className="row w-full flex-nowrap min-w-max">
          {VALUES.map((num) => {
            const isSelected = num === value;
            const isNeighbour = !!value && (num === (value - 1) || num === (value + 1));
            return (
              <div key={`value-${num}`} className="row w-full h-9 flex-1">
                <p
                  className={cn(
                    "w-9 ml-[-18px] text-center font-bold",
                    {
                      "text-dark": !isSelected,
                      "text-sm": !isSelected && !isNeighbour,
                      "text-lg": isNeighbour,
                      "text-3xl text-primary": isSelected,
                    }
                  )}
                  style={{ transition: "color 200ms ease-out, font-size 200ms ease-out" }}
                >
                  {num}
                </p>
              </div>
            )
          })}
        </div>

        <div className="row w-0 h-9">
          <p
            className={cn(
              "w-9 min-w-9 ml-[-18px] text-center font-bold",
              {
                "text-dark": !(value === 10),
                "text-sm": !(value === 10) && !(value === 9),
                "text-lg": value === 9,
                "text-3xl text-primary": value === 10,
              }
            )}
            style={{ transition: "color 200ms ease-out, font-size 200ms ease-out" }}
          >
            10
          </p>
        </div>
      </div>
    </div>
  )
}