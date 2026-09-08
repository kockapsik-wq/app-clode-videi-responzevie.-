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

  if (!job) {
    return NextResponse.json({ error: "Úloha nenalezena." }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    stage: job.stage,
    progress: job.progress,
    title: job.title,
    authorName: job.authorName,
    thumbnailUrl: job.thumbnailUrl,
    highlight: job.highlight,
    error: job.error,
    downloadUrl: job.stage === "done" ? `/api/jobs/${job.id}/download` : null,
  });
}
