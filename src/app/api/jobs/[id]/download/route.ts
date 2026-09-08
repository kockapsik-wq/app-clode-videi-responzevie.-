import fs from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/server/jobStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const job = getJob(id);

  if (!job || job.stage !== "done" || !job.outputPath) {
    return NextResponse.json({ error: "Klip zatím není hotový." }, { status: 404 });
  }

  const buffer = await fs.readFile(job.outputPath);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `inline; filename="strihai-${job.videoId}.mp4"`,
      "Cache-Control": "no-store",
    },
  });
}
