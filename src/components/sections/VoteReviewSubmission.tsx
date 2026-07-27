import type {Submission} from "#/models/supabaseTables.ts";
import TTBox from "#/components/primitives/TTBox.tsx";
import React from "react";
import {IoMusicalNotes} from "react-icons/io5";
import YouTubeEmbed from "#/components/embeds/YouTubeEmbed.tsx";
import SpotifyEmbed from "#/components/embeds/SpotifyEmbed.tsx";
import {getPlatform, platformYouTube} from "#/models/SupportedPlatforms.ts";

interface Props {
  submission: Submission;
}
export default function VoteReviewSubmission({ submission }: Props) {
  const urlPlatform = React.useMemo(() => {
    return getPlatform(submission.platform) ?? platformYouTube;
  }, [submission.platform]);

  const embedSize = React.useMemo(() => {
    if (urlPlatform?.key === "spotify") return { width: 288, height: 152 };
    return { width: 288, height: 162 };
  }, [urlPlatform?.key]);

  return (
    <TTBox className="row w-max h-max min-h-[196px] items-center">
      <div className="row h-max w-max overflow-hidden">
        {!submission.url_id && (
          <div
            className="row justify-center items-center rounded-xl"
            style={{ background: "linear-gradient(45deg, #1C75BC, #33C8B4)", ...embedSize }}>
            <IoMusicalNotes size={64} color="white" />
          </div>
        )}
        {!!submission.url_id && urlPlatform?.key === "youtube" && <YouTubeEmbed embedId={submission.url_id} {...embedSize} />}
        {!!submission.url_id && urlPlatform?.key === "spotify" && <SpotifyEmbed embedId={submission.url_id} {...embedSize} />}
      </div>
    </TTBox>
  )
}