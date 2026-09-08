import fs from "node:fs/promises";
import path from "node:path";
import { config } from "@/server/config";
import { run } from "@/server/exec";
import { buildSrt } from "@/server/captions";
import type { TranscriptSegment } from "@/server/types";

const OUTPUT_WIDTH = 1080;
const OUTPUT_HEIGHT = 1920;

/** Extracts 16kHz mono PCM WAV audio, the format whisper.cpp expects. */
export async function extractAudioForTranscription(
  sourcePath: string,
  workDir: string,
): Promise<string> {
  const wavPath = path.join(workDir, "audio.wav");
  await run(config.ffmpegBin, [
    "-y",
    "-i",
    sourcePath,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-c:a",
    "pcm_s16le",
    wavPath,
  ]);
  return wavPath;
}

function escapeForFilterPath(filePath: string): string {
  return filePath.replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/'/g, "\\'");
}

export interface RenderClipOptions {
  sourcePath: string;
  startMs: number;
  endMs: number;
  captions: TranscriptSegment[];
  workDir: string;
}

export async function renderVerticalClip(options: RenderClipOptions): Promise<string> {
  const { sourcePath, startMs, endMs, captions, workDir } = options;
  const durationSeconds = (endMs - startMs) / 1000;
  const startSeconds = startMs / 1000;

  const srtPath = path.join(workDir, "captions.srt");
  const srtContent = buildSrt(captions, startMs, endMs - startMs);
  await fs.writeFile(srtPath, srtContent, "utf-8");

  const outputPath = path.join(workDir, "clip.mp4");
  const escapedSrt = escapeForFilterPath(srtPath);

  const subtitleStyle = [
    "FontName=DejaVu Sans",
    "Fontsize=22",
    "Bold=1",
    "PrimaryColour=&H00FFFFFF",
    // With BorderStyle=3 (opaque box), libass fills the box using
    // OutlineColour, not BackColour, and `Outline` sets the box padding —
    // both had to be verified by rendering test frames, since force_style
    // silently no-ops on the "wrong" field instead of erroring.
    "OutlineColour=&H007A15E0",
    "BorderStyle=3",
    "Outline=10",
    "Shadow=0",
    "Alignment=2",
    "MarginV=110",
  ].join(",");

  const filterComplex = [
    `[0:v]scale=${OUTPUT_WIDTH}:-2:force_original_aspect_ratio=decrease,setsar=1[fg]`,
    `[0:v]scale=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}:force_original_aspect_ratio=increase,crop=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT},gblur=sigma=25,eq=brightness=-0.05[bg]`,
    `[bg][fg]overlay=(W-w)/2:(H-h)/2:shortest=1[stacked]`,
    `[stacked]subtitles='${escapedSrt}':force_style='${subtitleStyle}'[outv]`,
  ].join(";");

  await run(config.ffmpegBin, [
    "-y",
    "-ss",
    startSeconds.toFixed(3),
    "-i",
    sourcePath,
    "-t",
    durationSeconds.toFixed(3),
    "-filter_complex",
    filterComplex,
    "-map",
    "[outv]",
    "-map",
    "0:a?",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "20",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    outputPath,
  ]);

  return outputPath;
}
