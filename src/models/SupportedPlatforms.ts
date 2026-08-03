export type SupportedPlatformKey = "youtube" | "spotify" | "all";

export type SupportedPlatform = {
  key: SupportedPlatformKey;
  label: string;
  pattern: RegExp;
  urlTemplate: string;
}

export const platformYouTube: SupportedPlatform = {
  key: "youtube",
  label: "YouTube",
  pattern: new RegExp(
    /(?<=w{0,3}\.?\.youtube\.com\/watch\?v=|w{0,3}\.?youtu\.be\/|w{0,3}\.?youtube\.com\/shorts\/)[A-Za-z0-9-_]{10,12}/,
    "gm",
  ),
  urlTemplate: "https://www.youtube.com/watch?v=<submission_id>",
};

export const platformSpotify: SupportedPlatform = {
  key: "spotify",
  label: "Spotify",
  pattern: new RegExp(
    /(?<=spotify\.com\/track\/|spotify\.com\/embed\/track\/)\w{20,24}(?=\?|$)/,
    "gm",
  ),
  urlTemplate:
    "https://open.spotify.com/embed/track/<submission_id>?utm_source=generator",
};

export const allPlatforms: SupportedPlatform[] = [
  platformYouTube,
  platformSpotify,
];

export function getPlatform(
  key: string | null | undefined,
): SupportedPlatform | undefined {
  return allPlatforms.find(platform => platform.key === key);
}
