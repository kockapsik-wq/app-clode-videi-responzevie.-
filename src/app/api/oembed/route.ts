import { NextRequest, NextResponse } from "next/server";
import { extractYouTubeId, thumbnailUrl } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url") ?? "";
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return NextResponse.json(
      { error: "Neplatný odkaz na YouTube video." },
      { status: 400 },
    );
  }

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const oembedEndpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    watchUrl,
  )}&format=json`;

  try {
    const res = await fetch(oembedEndpoint, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Video se nepodařilo najít. Zkontroluj, že je veřejné." },
        { status: 404 },
      );
    }

    const data = (await res.json()) as { title?: string; author_name?: string };

    return NextResponse.json({
      videoId,
      title: data.title ?? "Video bez názvu",
      authorName: data.author_name ?? "Neznámý autor",
      thumbnailUrl: thumbnailUrl(videoId),
    });
  } catch {
    return NextResponse.json(
      { error: "Nepodařilo se spojit s YouTube. Zkus to prosím znovu." },
      { status: 502 },
    );
  }
}
