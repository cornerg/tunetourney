export type FileUploadResponse =
  | null
  | undefined
  | {
      id: string;
      path: string;
      fullPath: string;
    };

export type TournamentScore = {
  id: string;
  name: string | null | undefined;
  avatar: string | null | undefined;
  score: number;
}
