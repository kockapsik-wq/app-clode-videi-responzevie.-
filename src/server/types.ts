export type JobStage =
  | "queued"
  | "downloading"
  | "transcribing"
  | "selecting_highlight"
  | "rendering"
  | "done"
  | "error";

export interface TranscriptSegment {
  startMs: number;
  endMs: number;
  text: string;
}

export interface HighlightWindow {
  startMs: number;
  endMs: number;
  score: number;
  captions: TranscriptSegment[];
}

export interface Job {
  id: string;
  youtubeUrl: string;
  videoId: string;
  stage: JobStage;
  progress: number;
  title: string | null;
  authorName: string | null;
  thumbnailUrl: string | null;
  sourceDurationSeconds: number | null;
  highlight: HighlightWindow | null;
  outputPath: string | null;
  error: string | null;
  createdAt: number;
  updatedAt: number;
}
