import fs from "node:fs/promises";
import path from "node:path";
import { config } from "@/server/config";
import { run } from "@/server/exec";

export interface SourceVideo {
  filePath: string;
  title: string;
  authorName: string;
  durationSeconds: number;
  thumbnailUrl: string | null;
}

interface YtDlpInfo {
  title?: string;
  uploader?: string;
  channel?: string;
  duration?: number;
  thumbnail?: string;
}

export async function fetchVideoInfo(url: string): Promise<YtDlpInfo> {
  const { stdout } = await run(config.ytDlpBin, [
    "--dump-json",
    "--no-playlist",
    "--skip-download",
    url,
  ]);
  return JSON.parse(stdout) as YtDlpInfo;
}

export async function downloadSourceVideo(
  url: string,
  workDir: string,
): Promise<SourceVideo> {
  const info = await fetchVideoInfo(url);
  const duration = info.duration ?? 0;

  if (duration > config.maxSourceDurationSeconds) {
    throw new Error(
      `Video je příliš dlouhé (${Math.round(duration / 60)} min). ` +
        `Maximální podporovaná délka je ${config.maxSourceDurationSeconds / 60} minut.`,
    );
  }

  const outputTemplate = path.join(workDir, "source.%(ext)s");

  await run(config.ytDlpBin, [
    "-f",
    "bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720][ext=mp4]/best",
    "--merge-output-format",
    "mp4",
    "--no-playlist",
    "-o",
    outputTemplate,
    url,
  ]);

  const files = await fs.readdir(workDir);
  const sourceFile = files.find((f) => f.startsWith("source."));
  if (!sourceFile) {
    throw new Error("Stažení videa se nezdařilo — výstupní soubor nebyl nalezen.");
  }

  return {
    filePath: path.join(workDir, sourceFile),
    title: info.title ?? "Video bez názvu",
    authorName: info.uploader ?? info.channel ?? "Neznámý autor",
    durationSeconds: duration,
    thumbnailUrl: info.thumbnail ?? null,
  };
}
