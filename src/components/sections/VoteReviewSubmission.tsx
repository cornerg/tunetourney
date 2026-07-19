import type {Submission} from "#/models/supabaseTables.ts";
import TTBox from "#/components/primitives/TTBox.tsx";
import React from "react";
import {IoMusicalNotes} from "react-icons/io5";
import YouTubeEmbed from "#/components/embeds/YouTubeEmbed.tsx";
import {cn} from "#/utils/utils.ts";

interface Props {
  submission: Submission;
  placement: number;
}
export default function VoteReviewSubmission({ submission, placement }: Props) {
  const urlId = React.useMemo(() => submission?.url_id ?? "", [submission?.url_id]);

  return (
    <div className="relative row w-max h-max pl-6">
      <TTBox className="absolute row w-12 h-12 top-4 left-0 p-0 justify-center items-center z-[2] rounded-full">
        <p
          className={cn(
            "text-center mb-1 leading-none",
            {
              "text-4xl font-bold text-yellow-400": placement === 1,
              "text-3xl font-bold text-gray-400": placement === 2,
              "text-2xl font-bold text-amber-700": placement === 3,
              "text-xl text-gray-800": placement >= 4,
            }
          )}
        >
          {placement}
        </p>
      </TTBox>

      <TTBox className="w-max h-max pl-8">
        <div className="row h-[162px] w-[288px] justify-center items-center aspect-video rounded-lg overflow-hidden" style={{ background: "linear-gradient(45deg, #1C75BC, #33C8B4)" }}>
          {!urlId && <IoMusicalNotes size={64} color="white" />}
          {!!urlId && (
            <div className="h-[162px] w-[288px]">
              {submission.platform === "youtube" && <YouTubeEmbed embedId={urlId} width={288} height={162} />}
            </div>
          )}
        </div>
      </TTBox>
    </div>
  )
}