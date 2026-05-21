import { createFileRoute } from '@tanstack/react-router'
import React from "react";
import {getImageFromCollection} from "#/assets/imageCollections.ts";
import HomeRight from "#/components/sections/HomeRight.tsx";

function Home() {
  const backgroundImage = React.useMemo(() => getImageFromCollection("home"), []);

  return (
    <div className="row gap-0">
      <div
        className="relative column min-w-[50vw] min-h-[100vh] bg-cover"
        style={{ backgroundImage: `url(${backgroundImage?.url ?? ""})` }}
      >
        <div className="absolute top-0 left-0 w-full h-full flex" style={{ zIndex: 0, backdropFilter: "blur(4px)" }} />

        <div className="absolute column justify-end top-0 left-0 w-full h-full flex p-2 pointer-events-none" style={{ zIndex: 2 }}>
          {!!backgroundImage?.creator && (
            <p className="w-max text-sm text-white text-shadow-sm text-shadow-black italic">
              Image by <a href={backgroundImage.creditLink} target="_blank" className="pointer-events-auto cursor-pointer hover:underline">{backgroundImage.creator}</a>
            </p>
          )}
        </div>

        <div className="column w-full min-h-full p-4 justify-center items-center gap-2" style={{ zIndex: 1 }}>
          <p className="text-5xl serif font-bold text-center">Content Left</p>
        </div>
      </div>

      <HomeRight />
    </div>
  )
}

export const Route = createFileRoute('/')({ component: Home });
