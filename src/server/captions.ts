import type { TranscriptSegment } from "@/server/types";

function formatSrtTimestamp(ms: number): string {
  const clamped = Math.max(0, Math.round(ms));
  const hours = Math.floor(clamped / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1000);
  const millis = clamped % 1000;

  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(millis, 3)}`;
}

/**
 * Builds SRT content for captions inside a highlight window, re-timed so
 * that `windowStartMs` becomes 00:00:00 and captions are clamped to
 * `windowDurationMs`.
 */
export function buildSrt(
  captions: TranscriptSegment[],
  windowStartMs: number,
  windowDurationMs: number,
): string {
  const entries = captions
    .map((caption) => ({
      start: Math.max(0, caption.startMs - windowStartMs),
      end: Math.min(windowDurationMs, caption.endMs - windowStartMs),
      text: caption.text,
    }))
    .filter((entry) => entry.end > entry.start);

  return entries
    .map((entry, index) => {
      const from = formatSrtTimestamp(entry.start);
      const to = formatSrtTimestamp(entry.end);
      return `${index + 1}\n${from} --> ${to}\n${entry.text}\n`;
    })
    .join("\n");
}
