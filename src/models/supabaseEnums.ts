export type SUPPORTED_PLATFORMS = "youtube" | "spotify" | "all";

export interface SupportedPlatform {
  key: SUPPORTED_PLATFORMS;
  label: string;
}

export const platformYouTube: SupportedPlatform = {
  key: "youtube",
  label: "YouTube",
}

export const platformSpotify: SupportedPlatform = {
  key: "spotify",
  label: "Spotify",
}

export const allPlatforms: SupportedPlatform[] = [
  platformYouTube, platformSpotify
]