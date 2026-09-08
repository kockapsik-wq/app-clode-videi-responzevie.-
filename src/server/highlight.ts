import { config } from "@/server/config";
import type { HighlightWindow, TranscriptSegment } from "@/server/types";

const HYPE_KEYWORDS = [
  // česky
  "neuvěřitelné",
  "neuvěřitelný",
  "šílené",
  "šílený",
  "wow",
  "nikdy",
  "nejlepší",
  "nejhorší",
  "obrovský",
  "obrovské",
  "zázrak",
  "šokující",
  "vážně",
  "boom",
  "hele",
  "počkej",
  "nechápu",
  // english
  "amazing",
  "incredible",
  "insane",
  "unbelievable",
  "crazy",
  "best",
  "worst",
  "never",
  "shocking",
  "wow",
  "wait",
  "actually",
  "literally",
];

function segmentScore(text: string): number {
  const lower = text.toLowerCase();
  const wordCount = lower.split(/\s+/).filter(Boolean).length;

  let score = wordCount;
  score += (text.match(/!/g)?.length ?? 0) * 3;
  score += (text.match(/\?/g)?.length ?? 0) * 2;

  for (const keyword of HYPE_KEYWORDS) {
    if (lower.includes(keyword)) score += 4;
  }

  return score;
}

export function pickHighlight(
  segments: TranscriptSegment[],
  sourceDurationMs: number,
  windowMs: number = config.clipLengthSeconds * 1000,
): HighlightWindow {
  if (sourceDurationMs <= windowMs || segments.length === 0) {
    const end = Math.min(windowMs, sourceDurationMs);
    return {
      startMs: 0,
      endMs: end,
      score: 0,
      captions: segments.filter((s) => s.startMs < end),
    };
  }

  const scored = segments.map((s) => ({ ...s, score: segmentScore(s.text) }));

  let best: HighlightWindow = {
    startMs: 0,
    endMs: windowMs,
    score: -1,
    captions: [],
  };

  for (const candidate of scored) {
    const start = Math.min(candidate.startMs, sourceDurationMs - windowMs);
    const end = start + windowMs;

    const within = scored.filter((s) => s.startMs < end && s.endMs > start);
    const windowScore = within.reduce((sum, s) => sum + s.score, 0);

    if (windowScore > best.score) {
      best = {
        startMs: start,
        endMs: end,
        score: windowScore,
        captions: within.map(({ startMs, endMs, text }) => ({
          startMs,
          endMs,
          text,
        })),
      };
    }
  }

  return best;
}
