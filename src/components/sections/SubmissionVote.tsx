import type {Submission} from "#/models/supabaseTables.ts";
import TTBox from "#/components/primitives/TTBox.tsx";
import YouTubeEmbed from "#/components/embeds/YouTubeEmbed.tsx";
import React from "react";
import {IoMusicalNotes} from "react-icons/io5";
import ScoreSlider from "#/components/primitives/ScoreSlider.tsx";
import TTInput from "#/components/primitives/TTInput.tsx";

interface Props {
  submission: Submission;
  score: number | undefined;
  handleScore: (score: number) => void;
  comment: string;
  handleComment: (comment: string) => void;
}
export default function SubmissionVote({ submission, score, handleScore, comment, handleComment }: Props) {
  const urlId = React.useMemo(() => submission?.url_id, [submission?.url_id]);

  return (
    <TTBox className="w-full row gap-4">
      <div className="row h-[162px] w-[288px] justify-center items-center aspect-video rounded-lg overflow-hidden" style={{ background: "linear-gradient(45deg, #1C75BC, #33C8B4)" }}>
        {!urlId && <IoMusicalNotes size={64} color="white" />}
        {!!urlId && (
          <div className="h-[162px] w-[288px]">
            {submission.platform === "youtube" && <YouTubeEmbed embedId={urlId} width={288} height={162} />}
          </div>
        )}
      </div>

      <div className="column w-full h-[162px] flex-1 gap-2">
        <p className={submission?.comment?.trim()?.length ? undefined : "opacity-50 italic"}>{submission?.comment || "No notes"}</p>
        <hr className="w-full text-gray-300 mb-2" />

        <div className="column w-full h-full flex-1 justify-evenly gap-0">
          <div className="row w-full gap-2">
            <p className="font-bold text-nowrap">Your score</p>
            <ScoreSlider
              className="px-2"
              value={score}
              setValue={(value) => handleScore(value)}
            />
          </div>

          <TTInput
            className="w-full h-9"
            value={comment}
            onChange={(e) => handleComment(e.target.value)}
            label="Comment (optional)"
          />
        </div>
      </div>
    </TTBox>
  )
}
