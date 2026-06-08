import type {Round} from "#/models/supabaseTables.ts";
import React from "react";
import {useTournament} from "#/api/tournaments.ts";
import {allPlatforms} from "#/models/supabaseEnums.ts";
import TTInput from "#/components/primitives/TTInput.tsx";
import YouTubeEmbed from "#/components/embeds/YouTubeEmbed.tsx";

interface Props {
  round: Round | null | undefined;
}
export default function SubmissionEdit({ round }: Props) {
  const [submissionUrl, setSubmissionUrl] = React.useState<string>("");
  const [submissionComment, setSubmissionComment] = React.useState<string>("");

  const { data: tournament } = useTournament(round?.tournament_id);

  const supportedPlatforms = React.useMemo(() => {
    if (tournament?.platform === "all") return allPlatforms;
    return allPlatforms.filter((plat) => tournament?.platform === plat.key)
  }, [tournament?.platform]);

  const urlData = React.useMemo(() => {
    const ytIdRegex = new RegExp(/(?<=w{0,3}\.?\.youtube\.com\/watch\?v=|w{0,3}\.?youtu\.be\/|w{0,3}\.?youtube\.com\/shorts\/)[A-Za-z0-9-_]{10,12}/, "gm");
    if (supportedPlatforms.length > 1) {
      return {
        label: "Music URL",
        id: submissionUrl.match(ytIdRegex)?.[0] ?? "",
      }
    }
    if (supportedPlatforms[0]?.key === "youtube") {
      return {
        label: "YouTube Video URL",
        id: submissionUrl.match(ytIdRegex)?.[0] ?? "",
      }
    }
    if (supportedPlatforms[0]?.key === "spotify") {
      return {
        label: "Spotify Track URL",
        id: submissionUrl.match(ytIdRegex)?.[0] ?? "",
      }
    }
  }, [supportedPlatforms, submissionUrl]);

  return (
    <div className="column w-full">
      <div className="row w-full gap-4">
        <div className="h-[162px] w-[288px] aspect-video rounded-lg overflow-hidden">
          {!!urlData?.id && (
            <YouTubeEmbed embedId={urlData.id} width={288} height={162} />
          )}
        </div>

        <div className="column h-[162px] w-full justify-between gap-2 flex-1">
          <div className="row w-full justify-between gap-4">
            <h3 className="heading">Your Submission</h3>

            <button className="px-4 rounded-lg bg-primary text-surface font-bold text-center cursor-pointer">
              Submit
            </button>
          </div>

          <div className="column w-full gap-4">
            <TTInput
              className="w-full h-10"
              label={urlData?.label}
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
            />

            <TTInput
              className="w-full h-10"
              label="Comment (optional)"
              value={submissionComment}
              onChange={(e) => setSubmissionComment(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}