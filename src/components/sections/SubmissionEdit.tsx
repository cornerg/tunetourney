import type {Round, Submission} from "#/models/supabaseTables.ts";
import React from "react";
import {useTournament} from "#/api/tournaments.ts";
import {allPlatforms, getPlatform, type SupportedPlatform} from "#/models/SupportedPlatforms.ts";
import TTInput from "#/components/primitives/TTInput.tsx";
import YouTubeEmbed from "#/components/embeds/YouTubeEmbed.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import {IoMusicalNotes} from "react-icons/io5";
import {useInsertSubmission, useUpdateSubmission} from "#/api/submissions.ts";
import {useCurrentUserId} from "#/api/sessions.ts";
import TTBox from "#/components/primitives/TTBox.tsx";
import {useTTToast} from "#/components/primitives/TTToast.tsx";

interface Props {
  round: Round | null | undefined;
  savedSubmission?: Submission | undefined;
}
export default function SubmissionEdit({ round, savedSubmission }: Props) {
  const [submissionUrl, setSubmissionUrl] = React.useState<string>("");
  const [urlId, setUrlId] = React.useState<string>("");
  const [urlPlatform, setUrlPlatform] = React.useState<SupportedPlatform | undefined>();
  const [urlError, setUrlError] = React.useState<string>("");
  const [submissionComment, setSubmissionComment] = React.useState<string>("");
  const [isInserting, setIsInserting] = React.useState<boolean>(false);
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

  const presetSubmissionId = React.useRef<string>("");
  const urlChangeTimeout = React.useRef<NodeJS.Timeout | number>(-1);

  const { data: tournament } = useTournament(round?.tournament_id);
  const currentUserId = useCurrentUserId();
  const { mutate: insert, isPending: isInsertPending, isError: isInsertError, isSuccess: isInsertSuccess } = useInsertSubmission();
  const { mutate: update, isPending: isUpdatePending, isError: isUpdateError, isSuccess: isUpdateSuccess } = useUpdateSubmission();
  const { TTToast, toast } = useTTToast();

  const supportedPlatforms = React.useMemo(() => {
    if (tournament?.platform === "all") return allPlatforms;
    return allPlatforms.filter((plat) => tournament?.platform === plat.key)
  }, [tournament?.platform]);

  const handleUrl = React.useCallback((value: string) => {
    if (!value) {
      setUrlId("");
      setUrlPlatform(undefined);
      setUrlError("");
      return;
    }
    let id = "";
    for (let i = 0; i < supportedPlatforms.length && !id; i++) {
      id = value.match(supportedPlatforms[i]?.pattern)?.[0] ?? "";
      if (id) {
        setUrlPlatform(supportedPlatforms[i]);
      }
    }
    setUrlId(id);
    if (id) {
      setUrlError("");
    } else {
      setUrlError("Not a valid URL");
    }
  }, [supportedPlatforms]);

  const handleUrlBlur = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    if (urlChangeTimeout.current) {
      clearTimeout(urlChangeTimeout.current);
      urlChangeTimeout.current = -1;
    }
    handleUrl(event.target.value);
    event.currentTarget.blur();
  }, [handleUrl]);

  const handleUrlChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionUrl(event.target.value);
    if (urlChangeTimeout.current) {
      clearTimeout(urlChangeTimeout.current);
    }
    urlChangeTimeout.current = setTimeout(() => {
      handleUrl(event.target.value);
      urlChangeTimeout.current = -1;
    }, 3000);
  }, []);

  React.useEffect(() => {
    if (presetSubmissionId.current !== savedSubmission?.id) {
      if (handleUrl && supportedPlatforms?.length) {
        presetSubmissionId.current = savedSubmission?.id ?? "";
        setUrlId(savedSubmission?.url_id ?? "");
        setSubmissionComment(savedSubmission?.comment ?? "");
        if (savedSubmission?.url_id) {
          const initialPlatform = getPlatform(savedSubmission?.platform);
          if (initialPlatform) {
            handleUrl(initialPlatform.urlTemplate.replace("<submission_id>", savedSubmission?.url_id));
          }
        }
      }
    }
  }, [savedSubmission, handleUrl, supportedPlatforms]);

  const fieldLabel = React.useMemo(() => {
    if (supportedPlatforms.length > 1) {
      return "Submission URL";
    }
    if (supportedPlatforms[0]?.key === "youtube") {
      return "YouTube Video URL";
    }
    if (supportedPlatforms[0]?.key === "spotify") {
      return "Spotify Track URL";
    }
    return "Submission URL";
  }, [supportedPlatforms, submissionUrl]);

  const cleanUrl = React.useMemo(() => {
    if (!urlId || !urlPlatform) return;
    return urlPlatform.urlTemplate.replace("<submission_id>", urlId)
  }, [urlId, urlPlatform]);

  const submissionIssue = React.useMemo(() => {
    if (!urlId) return "Please enter a submission URL.";
    if (!!urlError) return urlError;
    if (!urlPlatform || !supportedPlatforms.map((plat) => plat.key).includes(urlPlatform.key)) return "Music source not supported."
    if (!cleanUrl) return "A clean URL couldn't be created.";
  }, [urlId, urlError, urlPlatform, supportedPlatforms, cleanUrl]);

  const hasDataChanged = React.useMemo(() => {
    if (!savedSubmission) return true;
    return urlId !== savedSubmission.url_id || submissionComment !== (savedSubmission.comment ?? "");
  }, [savedSubmission, urlId, submissionComment]);

  const handleSubmit = React.useCallback(() => {
    if (!urlId) {
      console.error("No valid URL to save");
      return;
    }
    if (!currentUserId) {
      console.error("No user ID to save to");
      return;
    }
    if (!round?.id) {
      console.error("No round to save to");
      return;
    }

    if (!!savedSubmission?.id) {
      let saveData: Partial<Submission> = {};
      if (urlId !== savedSubmission.url_id) {
        saveData.url_id = urlId;
      }
      if (submissionComment !== (savedSubmission.comment ?? "")) {
        saveData.comment = submissionComment;
      }
      setIsUpdating(true);
      update({ id: savedSubmission.id, ...saveData });
    } else {
      setIsInserting(true);
      insert({ user_id: currentUserId, round_id: round.id, url_id: urlId, comment: submissionComment ?? ""  });
    }
  }, [urlId, currentUserId, round, savedSubmission, insert, update, submissionComment]);

  React.useEffect(() => {
    if (isInserting || isUpdating) {
      if (isInserting && !isInsertPending) {
        if (isInsertError) {
          toast({
            title: "An Error Occurred",
            message: "An error occurred while saving your submission.",
            type: "error",
          });
        }
        if (isInsertSuccess) {
          toast({
            title: "Submission Saved",
            message: "Your submission has been saved.",
            type: "success",
          });
        }
        setIsInserting(false);
      }

      if (isUpdating && !isUpdatePending) {
        if (isUpdateError) {
          toast({
            title: "An Error Occurred",
            message: "An error occurred while updating your submission.",
            type: "error",
          });
        }
        if (isUpdateSuccess) {
          toast({
            title: "Submission Saved",
            message: "Your submission has been updated.",
            type: "success",
          });
        }
        setIsUpdating(false);
      }
    }
  }, [isInserting, isUpdating, isInsertPending, isInsertError, isInsertSuccess, isUpdatePending, isUpdateError, isUpdateSuccess]);

  return (
    <TTBox className="column w-full">
      <div className="row w-full gap-4">
        <div className="row h-[162px] w-[288px] justify-center items-center aspect-video rounded-lg overflow-hidden" style={{ background: "linear-gradient(45deg, #1C75BC, #33C8B4)" }}>
          {!urlId && <IoMusicalNotes size={64} color="white" />}
          {!!urlId && (
            <div className="h-[162px] w-[288px]">
              {urlPlatform?.key === "youtube" && <YouTubeEmbed embedId={urlId} width={288} height={162} />}
            </div>
          )}
        </div>

        <div className="column h-[162px] w-full justify-between gap-2 flex-1">
          <div className="row w-full justify-between gap-4">
            <h3 className="heading">Your Submission</h3>

            <TTButton className="px-2" buttonStyle="primary" disabled={!hasDataChanged || !!submissionIssue} tooltip={submissionIssue} onClick={handleSubmit}>
              {!!savedSubmission && !hasDataChanged ? "Saved" : "Submit"}
            </TTButton>
          </div>

          <div className="column w-full gap-4">
            <TTInput
              className="w-full h-10"
              label={fieldLabel}
              value={submissionUrl}
              error={urlError}
              onChange={handleUrlChange}
              onBlur={handleUrlBlur}
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

      <TTToast />
    </TTBox>
  )
}