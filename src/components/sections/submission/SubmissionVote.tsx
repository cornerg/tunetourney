import React from "react";
import SpotifyEmbed from "#/components/embeds/SpotifyEmbed.tsx";
import YouTubeEmbed from "#/components/embeds/YouTubeEmbed.tsx";
import ScoreSlider from "#/components/primitives/ScoreSlider.tsx";
import TTBox from "#/components/primitives/TTBox.tsx";
import TTInput from "#/components/primitives/TTInput.tsx";
import type { Submission } from "#/models/supabaseTables.ts";
import { getPlatform, platformYouTube } from "#/models/SupportedPlatforms.ts";
import { IoMusicalNotes } from "react-icons/io5";

type Props = {
  submission: Submission;
  score: number | undefined;
  handleScore: (score: number) => void;
  comment: string;
  handleComment: (comment: string) => void;
}
export default function SubmissionVote({
  submission,
  score,
  handleScore,
  comment,
  handleComment,
}: Props) {
  const urlPlatform = React.useMemo(() => {
    return getPlatform(submission.platform) ?? platformYouTube;
  }, [submission.platform]);

  const embedSize = React.useMemo(() => {
    if (urlPlatform?.key === "spotify") return { width: 288, height: 152 };
    return { width: 288, height: 162 };
  }, [urlPlatform?.key]);

  return (
    <TTBox className="w-full row gap-4">
      <div className="row h-max w-max overflow-hidden">
        {!submission.url_id && (
          <div
            className="row justify-center items-center rounded-xl"
            style={{
              background: "linear-gradient(45deg, #1C75BC, #33C8B4)",
              ...embedSize,
            }}>
            <IoMusicalNotes size={64} color="white" />
          </div>
        )}
        {!!submission.url_id && urlPlatform?.key === "youtube" && (
          <YouTubeEmbed embedId={submission.url_id} {...embedSize} />
        )}
        {!!submission.url_id && urlPlatform?.key === "spotify" && (
          <SpotifyEmbed embedId={submission.url_id} {...embedSize} />
        )}
      </div>

      <div
        className="column w-full h-max justify-between flex-1 gap-2"
        style={{ minHeight: embedSize.height }}>
        <p
          className={
            submission?.comment?.trim()?.length
              ? undefined
              : "opacity-50 italic"
          }>
          {submission?.comment || "No notes"}
        </p>
        <hr className="w-full text-gray-300" />

        <div className="column w-full h-full flex-1 justify-evenly gap-0">
          <div className="column w-full gap-0 overflow-x-hidden">
            <p className="font-bold text-nowrap">Your score</p>
            <ScoreSlider
              value={score}
              setValue={value => handleScore(value)}
            />
          </div>

          <TTInput
            className="w-full h-9"
            value={comment}
            onChange={e => handleComment(e.target.value)}
            label="Comment (optional)"
          />
        </div>
      </div>
    </TTBox>
  );
}
