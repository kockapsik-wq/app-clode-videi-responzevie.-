const YOUTUBE_ID_PATTERN =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/))([a-zA-Z0-9_-]{11})/;

export function extractYouTubeId(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  const match = trimmed.match(YOUTUBE_ID_PATTERN);
  if (match) return match[1];

  try {
    const url = new URL(trimmed);
    const v = url.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
  } catch {
    // not a valid absolute URL
  }

  return null;
}

export function isYouTubeUrl(rawUrl: string): boolean {
  return extractYouTubeId(rawUrl) !== null;
}
