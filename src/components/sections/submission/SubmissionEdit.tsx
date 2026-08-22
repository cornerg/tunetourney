import React from "react";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useUpdateSubmission } from "#/api/Submissions/updateSubmission.ts";
import { useInsertSubmission } from "#/api/Submissions/insertSubmission.ts";
import SpotifyEmbed from "#/components/embeds/SpotifyEmbed.tsx";
import YouTubeEmbed from "#/components/embeds/YouTubeEmbed.tsx";
import TTBox from "#/components/primitives/TTBox.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import TTInput from "#/components/primitives/TTInput.tsx";
import type { Round, Submission } from "#/models/supabaseTables.ts";
import {
  allPlatforms,
  getPlatform,
  type SupportedPlatform,
} from "#/models/SupportedPlatforms.ts";
import { IoMusicalNotes } from "react-icons/io5";
import { useTournament } from "#/hooks/tournamentHooks.ts";
import { useToast } from "#/state/toastStore.ts";
import SubmissionInput from "#/components/primitives/SubmissionInput.tsx";

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
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const presetSubmissionId = React.useRef<string>("");

  const { tournament } = useTournament(round?.tournament_id);
  const currentUserId = useCurrentUserId();
  const { mutateAsync: insert } = useInsertSubmission();
  const { mutateAsync: update } = useUpdateSubmission();
  const { showToast } = useToast();

  const supportedPlatforms = React.useMemo(() => {
    if (tournament?.platform === "all") return allPlatforms;
    return allPlatforms.filter(plat => tournament?.platform === plat.key);
  }, [tournament?.platform]);

  // Use the newly entered URL value to set the URL ID, platform, and error states
  const handleUrl = React.useCallback(
    (value: string) => {
      setUrlId("");
      setUrlPlatform(undefined);
      setUrlError("");
      if (!value) return;
      let id = "";
      for (const platform of supportedPlatforms) {
        id = value.match(platform.pattern)?.[0] ?? "";
        if (id) {
          setUrlPlatform(platform);
          setUrlId(id);
          setUrlError("");
          break;
        }
      }
      if (!id) {
        setUrlError("Not a valid URL");
      }
    },
    [supportedPlatforms],
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

  const handleSubmit = React.useCallback(async () => {
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

    setIsSaving(true);
    try {
      let response: Submission | null | undefined;
      if (savedSubmission?.id) {
        const saveData: Partial<Submission> = {};
        if (urlId !== savedSubmission.url_id) {
          saveData.url_id = urlId;
        }
        if (submissionComment !== (savedSubmission.comment ?? "")) {
          saveData.comment = submissionComment;
        }
        response = await update({ id: savedSubmission.id, ...saveData });
      } else {
        response = await insert({
          user_id: currentUserId,
          round_id: round.id,
          url_id: urlId,
          comment: submissionComment ?? "",
        });
      }
      if (!response) {
        throw new Error("Invalid response from saving submission");
      }
      showToast({
        title: "Submission saved!",
        message: "Thank you for submitting! Voting will start soon.",
        type: "success",
      })
    } catch (error) {
      console.error(error);
      showToast({
        title: "An Error Occurred",
        message: "An error occurred while saving your submission.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }, [urlId, currentUserId, round, savedSubmission, submissionComment, update, insert, showToast]);

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
  }, [savedSubmission, urlId]);

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
              disabled={!hasDataChanged || !!submissionIssue || isSaving}
              tooltip={submissionIssue}
              onClick={handleSubmit}>
              {saveButtonText}
            </TTButton>
          </div>

          <div className="column w-full h-max justify-end flex-1 gap-3">
            <SubmissionInput
              sourceValue={submissionUrl}
              platform={(supportedPlatforms.length === 1 ? supportedPlatforms[0] : urlPlatform)?.key}
              error={urlError}
              handleUrl={handleUrl}
              disabled={isSaving}
            />

            <TTInput
              className="w-full h-10"
              label="Comment (optional)"
              disabled={isSaving}
              value={submissionComment}
              onChange={e => setSubmissionComment(e.target.value)}
            />
          </div>
        </div>
      </div>
    </TTBox>
  );
}
