import React from "react";
import { cn } from "#/utils/utils.ts";
import { Slider } from "radix-ui";

import "@/styles/ScoreSlider.css";

const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: number | undefined;
  setValue: (value: number) => void;
}
export default function ScoreSlider({
  value,
  setValue,
  className,
  ...props
}: Props) {
  return (
    <div className={cn("column w-full gap-0", className)} {...props}>
      <div className="row w-full items-center gap-0">
        <div
          className="w-full mr-[-8px] flex-1 h-3 rounded-l-lg bg-primary"
          onClick={() => setValue(1)}
        />

        <Slider.Root
          className="sliderRoot relative flex items-center select-none touch-none w-full flex-[18] h-8"
          min={1}
          max={10}
          step={1}
          value={[value || 1]}
          onValueChange={values => {
            setValue(values[0]);
          }}>
          <Slider.Track className="sliderTrack relative bg-dark grow h-3 cursor-pointer">
            <Slider.Range className="absolute bg-primary h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="sliderThumb block w-4 h-8 bg-secondary rounded-xl cursor-pointer hover:border-4 hover:border-secondary"
            aria-label="Score"
          />
        </Slider.Root>

        <div
          className="w-full ml-[-8px] flex-1 h-3 rounded-r-lg bg-dark"
          onClick={() => setValue(10)}
        />
      </div>

      <div className="row w-full flex-nowrap">
        {VALUES.map(num => {
          const isSelected = num === value;
          const isNeighbour =
            !!value && (num === value - 1 || num === value + 1);
          return (
            <div
              key={`value-${num}`}
              className="row w-full h-9 flex-1 justify-center"
              onClick={() => setValue(num)}>
              <p
                className={cn("w-9 text-center font-bold select-none", {
                  "text-dark": !isSelected,
                  "text-sm mt-[-8px]": !isSelected && !isNeighbour,
                  "text-lg mt-[-5px]": isNeighbour,
                  "text-3xl mt-[-2px] text-primary": isSelected,
                })}
                style={{
                  transition:
                    "color 200ms ease-out, font-size 200ms ease-out, margin-top 200ms ease-out",
                }}>
                {num}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
