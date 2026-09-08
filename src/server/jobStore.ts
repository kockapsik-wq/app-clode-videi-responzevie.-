import { randomUUID } from "node:crypto";
import { config } from "@/server/config";
import type { Job } from "@/server/types";

declare global {
  var __strihaiJobs: Map<string, Job> | undefined;
}

const jobs = globalThis.__strihaiJobs ?? new Map<string, Job>();
globalThis.__strihaiJobs = jobs;

export function createJob(youtubeUrl: string, videoId: string): Job {
  const now = Date.now();
  const job: Job = {
    id: randomUUID(),
    youtubeUrl,
    videoId,
    stage: "queued",
    progress: 0,
    title: null,
    authorName: null,
    thumbnailUrl: null,
    sourceDurationSeconds: null,
    highlight: null,
    outputPath: null,
    error: null,
    createdAt: now,
    updatedAt: now,
  };
  jobs.set(job.id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, patch: Partial<Job>): void {
  const existing = jobs.get(id);
  if (!existing) return;
  jobs.set(id, { ...existing, ...patch, updatedAt: Date.now() });
}

export function reapExpiredJobs(): void {
  const cutoff = Date.now() - config.jobTtlMs;
  for (const [id, job] of jobs) {
    if (job.createdAt < cutoff) jobs.delete(id);
  }
}
