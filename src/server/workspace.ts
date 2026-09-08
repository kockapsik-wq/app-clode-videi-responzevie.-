import fs from "node:fs/promises";
import path from "node:path";
import { config } from "@/server/config";

export async function createJobWorkspace(jobId: string): Promise<string> {
  const dir = path.join(config.workDir, jobId);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function removeJobWorkspace(jobId: string): Promise<void> {
  const dir = path.join(config.workDir, jobId);
  await fs.rm(dir, { recursive: true, force: true });
}
