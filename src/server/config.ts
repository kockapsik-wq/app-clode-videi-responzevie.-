import os from "node:os";
import path from "node:path";

function envOr(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

export const config = {
  ytDlpBin: envOr("YTDLP_BIN", "yt-dlp"),
  ffmpegBin: envOr("FFMPEG_BIN", "ffmpeg"),
  ffprobeBin: envOr("FFPROBE_BIN", "ffprobe"),
  whisperBin: envOr("WHISPER_CPP_BIN", "whisper-cli"),
  whisperModel: envOr(
    "WHISPER_MODEL_PATH",
    path.join(process.cwd(), "models", "ggml-base.bin"),
  ),
  workDir: envOr("STRIHAI_WORK_DIR", path.join(os.tmpdir(), "strihai-jobs")),
  clipLengthSeconds: 15,
  maxSourceDurationSeconds: 60 * 30,
  jobTtlMs: 1000 * 60 * 60,
};
