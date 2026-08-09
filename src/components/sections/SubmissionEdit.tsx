import React from "react";
import { useCurrentUserId } from "#/api/sessions.ts";
import { useInsertSubmission, useUpdateSubmission } from "#/api/submissions.ts";
import SpotifyEmbed from "#/components/embeds/SpotifyEmbed.tsx";
import YouTubeEmbed from "#/components/embeds/YouTubeEmbed.tsx";
import TTBox from "#/components/primitives/TTBox.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import TTInput from "#/components/primitives/TTInput.tsx";
import { useTTToast } from "#/components/primitives/TTToast.tsx";
import type { Round, Submission } from "#/models/supabaseTables.ts";
import {
  allPlatforms,
  getPlatform,
  type SupportedPlatform,
} from "#/models/SupportedPlatforms.ts";
import { IoMusicalNotes } from "react-icons/io5";
import { useTournament } from "#/hooks/tournamentHooks.ts";

type Props = {
  round: Round | null | undefined;
  savedSubmission?: Submission | undefined;
}
export default function SubmissionEdit({ round, savedSubmission }: Props) {
  const [submissionUrl, setSubmissionUrl] = React.useState<string>("");
  const [urlId, setUrlId] = React.useState<string>("");
  const [urlPlatform, setUrlPlatform] = React.useState<
    SupportedPlatform | undefined
  >();
  const [urlError, setUrlError] = React.useState<string>("");
  const [submissionComment, setSubmissionComment] = React.useState<string>("");
  const [isInserting, setIsInserting] = React.useState<boolean>(false);
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

  const presetSubmissionId = React.useRef<string>("");
  const urlChangeTimeout = React.useRef<NodeJS.Timeout | number>(-1);

  const { tournament } = useTournament(round?.tournament_id);
  const currentUserId = useCurrentUserId();
  const {
    mutate: insert,
    isPending: isInsertPending,
    isError: isInsertError,
    isSuccess: isInsertSuccess,
  } = useInsertSubmission();
  const {
    mutate: update,
    isPending: isUpdatePending,
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
  } = useUpdateSubmission();
  const { TTToast, toast } = useTTToast();

  const supportedPlatforms = React.useMemo(() => {
    if (tournament?.platform === "all") return allPlatforms;
    return allPlatforms.filter(plat => tournament?.platform === plat.key);
  }, [tournament?.platform]);

  // Use the newly entered URL value to set the URL ID, platform, and error states
  const handleUrl = React.useCallback(
    (value: string) => {
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
    },
    [supportedPlatforms],
  );

  // If the input is deselected, cancel the change confirmation timer and handle it right away
  const handleUrlBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (urlChangeTimeout.current) {
        clearTimeout(urlChangeTimeout.current);
        urlChangeTimeout.current = -1;
      }
      handleUrl(event.target.value);
      event.currentTarget.blur();
    },
    [handleUrl],
  );

  // Whenever the entered value of the URL input changes, set a timer. If the value isn't changed in that time, the value will be handled
  const handleUrlChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSubmissionUrl(event.target.value);
      if (urlChangeTimeout.current) {
        clearTimeout(urlChangeTimeout.current);
      }
      urlChangeTimeout.current = setTimeout(() => {
        handleUrl(event.target.value);
        urlChangeTimeout.current = -1;
      }, 3000);
    },
    [handleUrl],
  );

  // Handle updating states to match the saved data received from the database
  const syncWithSaved = React.useCallback(
    (saved: Submission) => {
      presetSubmissionId.current = saved.id;
      if (saved.url_id && saved.platform) {
        const platform = getPlatform(saved.platform);
        if (platform) {
          setUrlPlatform(platform);
          setSubmissionUrl(
            platform.urlTemplate.replace("<submission_id>", saved.url_id),
          );
          setUrlId(saved.url_id);
        }
      }
      setSubmissionComment(saved.comment ?? "");
    },
    [],
  );

  // Check for new saved data being received, and call the sync function
  React.useEffect(() => {
    if (
      savedSubmission?.id &&
      presetSubmissionId.current !== (savedSubmission?.id ?? "")
    ) {
      syncWithSaved(savedSubmission);
    }
  }, [savedSubmission, handleUrl, syncWithSaved]);

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
  }, [supportedPlatforms]);

  const cleanUrl = React.useMemo(() => {
    if (!urlId || !urlPlatform) return;
    return urlPlatform.urlTemplate.replace("<submission_id>", urlId);
  }, [urlId, urlPlatform]);

  const submissionIssue = React.useMemo(() => {
    if (!urlId) return "Please enter a submission URL.";
    if (urlError) return urlError;
    if (
      !urlPlatform ||
      !supportedPlatforms.map(plat => plat.key).includes(urlPlatform.key)
    )
      return "Music source not supported.";
    if (!cleanUrl) return "A clean URL couldn't be created.";
  }, [urlId, urlError, urlPlatform, supportedPlatforms, cleanUrl]);

  const hasDataChanged = React.useMemo(() => {
    if (!savedSubmission) return true;
    return (
      urlId !== savedSubmission.url_id ||
      submissionComment !== (savedSubmission.comment ?? "")
    );
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

    if (savedSubmission?.id) {
      const saveData: Partial<Submission> = {};
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
      insert({
        user_id: currentUserId,
        round_id: round.id,
        url_id: urlId,
        comment: submissionComment ?? "",
      });
    }
  }, [
    urlId,
    currentUserId,
    round,
    savedSubmission,
    insert,
    update,
    submissionComment,
  ]);

  const embedSize = React.useMemo(() => {
    if (urlPlatform?.key === "spotify") return { width: 288, height: 152 };
    return { width: 288, height: 162 };
  }, [urlPlatform?.key]);

  const saveButtonText = React.useMemo(() => {
    if (savedSubmission?.id) {
      if (urlId === savedSubmission.url_id) {
        return "Saved";
      } else {
        return "Update";
      }
    } else {
      return "Submit";
    }
  }, [savedSubmission?.id, savedSubmission?.url_id, urlId]);

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
  }, [isInserting, isUpdating, isInsertPending, isInsertError, isInsertSuccess, isUpdatePending, isUpdateError, isUpdateSuccess, toast]);

  return (
    <TTBox className="column w-full">
      <div className="row w-full gap-4">
        <div className="row h-max w-max overflow-hidden">
          {!urlId && (
            <div
              className="row justify-center items-center rounded-xl"
              style={{
                background: "linear-gradient(45deg, #1C75BC, #33C8B4)",
                ...embedSize,
              }}>
              <IoMusicalNotes size={64} color="white" />
            </div>
          )}
          {!!urlId && urlPlatform?.key === "youtube" && (
            <YouTubeEmbed embedId={urlId} {...embedSize} />
          )}
          {!!urlId && urlPlatform?.key === "spotify" && (
            <SpotifyEmbed embedId={urlId} {...embedSize} />
          )}
        </div>

        <div
          className="column h-max w-full justify-between gap-2 flex-1"
          style={{ minHeight: embedSize.height }}>
          <div className="row w-full justify-between gap-4">
            <h3 className="heading">Your Submission</h3>

            <TTButton
              className="px-2"
              buttonStyle="primary"
              disabled={!hasDataChanged || !!submissionIssue}
              tooltip={submissionIssue}
              onClick={handleSubmit}>
              {saveButtonText}
            </TTButton>
          </div>

          <div className="column w-full h-max justify-end flex-1 gap-3">
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
              onChange={e => setSubmissionComment(e.target.value)}
            />
          </div>
        </div>
      </div>

      <TTToast />
    </TTBox>
  );
}
