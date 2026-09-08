import { getJob, updateJob } from "@/server/jobStore";
import { createJobWorkspace } from "@/server/workspace";
import { downloadSourceVideo } from "@/server/ytdlp";
import { extractAudioForTranscription, renderVerticalClip } from "@/server/ffmpegRender";
import { transcribeAudio } from "@/server/whisper";
import { pickHighlight } from "@/server/highlight";

export async function runPipeline(jobId: string): Promise<void> {
  const job = getJob(jobId);
  if (!job) return;

  try {
    const workDir = await createJobWorkspace(jobId);

    updateJob(jobId, { stage: "downloading", progress: 10 });
    const source = await downloadSourceVideo(job.youtubeUrl, workDir);
    updateJob(jobId, {
      title: source.title,
      authorName: source.authorName,
      thumbnailUrl: source.thumbnailUrl,
      sourceDurationSeconds: source.durationSeconds,
      progress: 35,
    });

    updateJob(jobId, { stage: "transcribing", progress: 45 });
    const wavPath = await extractAudioForTranscription(source.filePath, workDir);
    const segments = await transcribeAudio(wavPath, workDir);
    updateJob(jobId, { progress: 65 });

    updateJob(jobId, { stage: "selecting_highlight", progress: 70 });
    const highlight = pickHighlight(segments, source.durationSeconds * 1000);
    updateJob(jobId, { highlight, progress: 75 });

    updateJob(jobId, { stage: "rendering", progress: 80 });
    const outputPath = await renderVerticalClip({
      sourcePath: source.filePath,
      startMs: highlight.startMs,
      endMs: highlight.endMs,
      captions: highlight.captions,
      workDir,
    });

    updateJob(jobId, { stage: "done", progress: 100, outputPath });
  } catch (err) {
    updateJob(jobId, {
      stage: "error",
      error: err instanceof Error ? err.message : "Neznámá chyba při zpracování videa.",
    });
  }
}
