import { NextRequest, NextResponse } from "next/server";
import { extractYouTubeId } from "@/lib/youtube";
import { createJob, reapExpiredJobs } from "@/server/jobStore";
import { runPipeline } from "@/server/pipeline";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  reapExpiredJobs();

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : "";
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return NextResponse.json(
      { error: "Neplatný odkaz na YouTube video." },
      { status: 400 },
    );
  }

  const job = createJob(url, videoId);

  // Fire and forget — progress is tracked via GET /api/jobs/[id].
  void runPipeline(job.id);

  return NextResponse.json({ jobId: job.id });
}
