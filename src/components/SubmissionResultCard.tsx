import type {Submission, Vote} from "#/models/supabaseTables.ts";
import React from "react";
import TTBox from "#/components/primitives/TTBox.tsx";
import {cn} from "#/utils/utils.ts";
import {IoMusicalNotes} from "react-icons/io5";
import YouTubeEmbed from "#/components/embeds/YouTubeEmbed.tsx";
import ProfilePhoto from "#/components/ProfilePhoto.tsx";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import {useTournamentUsers} from "#/api/users.ts";
import {FaChevronRight} from "react-icons/fa6";
import SpotifyEmbed from "#/components/embeds/SpotifyEmbed.tsx";
import {getPlatform, platformYouTube} from "#/models/SupportedPlatforms.ts";

interface Props {
  submission: Submission;
  votes: Vote[];
  placement: number;
  tournamentId: string;
}
export default function SubmissionResultCard({ submission, votes, placement, tournamentId }: Props) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const { data: participants } = useTournamentUsers(tournamentId);

  const totalScore = React.useMemo(() => votes?.reduce((total, cur) => total + cur.score, 0), [votes]);
  const sortedVotes = React.useMemo(() => {
    return [...votes].sort((a, b) => b.score - a.score);
  }, [votes]);
  const submitter = React.useMemo(() => participants?.find((user) => user.id === submission.user_id), [participants, submission.user_id]);

  const urlPlatform = React.useMemo(() => {
    return getPlatform(submission.platform) ?? platformYouTube;
  }, [submission.platform]);

  const embedSize = React.useMemo(() => {
    if (urlPlatform?.key === "spotify") return { width: 288, height: 152 };
    return { width: 288, height: 162 };
  }, [urlPlatform?.key]);

  const handleExpand = React.useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <div className="relative row w-full h-max pl-6">
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

      <TTBox className="row w-full gap-4 pl-8">
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

        <div className="column w-full flex-1 gap-2">
          <div className="row -full justify-between items-center gap-4">
            <div className="row w-full items-center gap-2 flex-1">
              <TTTooltip label={submitter?.name ?? "Unnamed User"} delay={30}>
                <ProfilePhoto user={submitter} size={32} fontSize={14} className="rounded-full bg-surface" />
              </TTTooltip>

              <p>{submitter?.name ?? "Unnamed User"}</p>
            </div>

            <div className="row w-full justify-end items-center gap-2 flex-1">

              <p>Score: </p>
              <p className="font-bold text-lg">{totalScore.toLocaleString("en-US")}</p>
            </div>
          </div>

          {(submission.comment?.length ?? 0) > 0 && <p>{submission.comment}</p>}

          <div className="column w-full gap-0">
            <div className="row w-full items-center gap-2 cursor-pointer" onClick={handleExpand}>
              <h4 className="subheading font-bold text-dark">Votes</h4>
              <FaChevronRight
                size={16}
                style={{ transition: "rotate 150ms ease" }}
                className={cn("text-dark", { "rotate-90": isExpanded })}
              />
              <hr className="w-full text-dark" />
            </div>

            {isExpanded && (
              <div className="column w-full pl-1">
                {sortedVotes.map((vote, i) => {
                  const voter = participants?.find((user) => user.id === vote.user_id);
                  return (
                    <div
                      key={vote.id}
                      className={
                      cn(
                        "row w-full py-1 pl-1 gap-4",
                        {
                          "border-b border-b-gray-200": i < (sortedVotes.length - 1)
                        }
                      )}
                    >
                      <div className="row w-max gap-2 items-center min-h-6">
                        <TTTooltip label={voter?.name ?? "Unnamed User"} delay={30}>
                          <ProfilePhoto user={voter} size={24} fontSize={11} className="rounded-full bg-surface" />
                        </TTTooltip>

                        <p className="font-bold text-sm">{vote.score}</p>
                      </div>

                      <p className="text-sm h-max pt-0.5">{vote.comment ?? ""}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </TTBox>
    </div>
  )
}