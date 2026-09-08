import { spawn } from "node:child_process";

export class ProcessError extends Error {
  constructor(
    public readonly command: string,
    public readonly exitCode: number | null,
    public readonly stderrTail: string,
  ) {
    super(
      `Příkaz "${command}" selhal (kód ${exitCode ?? "?"}): ${stderrTail.slice(-500)}`,
    );
    this.name = "ProcessError";
  }
}

export function run(
  command: string,
  args: string[],
  options: { cwd?: string } = {},
): Promise<{ stdout: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: options.cwd });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (err) => {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        reject(
          new Error(
            `Nástroj "${command}" nebyl na serveru nalezen. Zkontroluj instalaci a proměnné prostředí.`,
          ),
        );
        return;
      }
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout });
      } else {
        reject(new ProcessError(command, code, stderr || stdout));
      }
    });
  });
}
