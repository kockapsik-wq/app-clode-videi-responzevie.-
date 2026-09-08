import fs from "node:fs/promises";
import path from "node:path";
import { config } from "@/server/config";
import { run } from "@/server/exec";
import type { TranscriptSegment } from "@/server/types";

interface WhisperJsonSegment {
  offsets: { from: number; to: number };
  text: string;
}

interface WhisperJsonOutput {
  transcription: WhisperJsonSegment[];
}

export async function transcribeAudio(
  wavPath: string,
  workDir: string,
): Promise<TranscriptSegment[]> {
  try {
    await fs.access(config.whisperModel);
  } catch {
    throw new Error(
      `Chybí AI model pro přepis řeči (${config.whisperModel}). ` +
        `Spusť "npm run setup:whisper" na serveru a zkus to znovu.`,
    );
  }

  const outputBase = path.join(workDir, "transcript");

  await run(config.whisperBin, [
    "-m",
    config.whisperModel,
    "-f",
    wavPath,
    "-of",
    outputBase,
    "-oj",
    "-l",
    "auto",
    "-nt",
  ]);

  const jsonPath = `${outputBase}.json`;
  const raw = await fs.readFile(jsonPath, "utf-8");
  const parsed = JSON.parse(raw) as WhisperJsonOutput;

  return parsed.transcription
    .map((segment) => ({
      startMs: segment.offsets.from,
      endMs: segment.offsets.to,
      text: segment.text.trim(),
    }))
    .filter((segment) => segment.text.length > 0);
}
