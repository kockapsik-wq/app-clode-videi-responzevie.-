"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { isYouTubeUrl } from "@/lib/youtube";
import ResultCard, { type ClipResult } from "@/components/ResultCard";

type Status = "idle" | "starting" | "processing" | "done" | "error";

type Stage =
  | "queued"
  | "downloading"
  | "transcribing"
  | "selecting_highlight"
  | "rendering"
  | "done"
  | "error";

const STAGE_LABELS: Record<Stage, string> = {
  queued: "Ve frontě…",
  downloading: "Stahuji video z YouTube…",
  transcribing: "Přepisuji řeč na text…",
  selecting_highlight: "Hledám nejzajímavější moment…",
  rendering: "Skládám finální klip a vypaluji titulky…",
  done: "Hotovo",
  error: "Chyba",
};

interface JobResponse {
  id: string;
  stage: Stage;
  progress: number;
  title: string | null;
  authorName: string | null;
  thumbnailUrl: string | null;
  highlight: {
    startMs: number;
    endMs: number;
    captions: { startMs: number; endMs: number; text: string }[];
  } | null;
  error: string | null;
  downloadUrl: string | null;
}

const POLL_INTERVAL_MS = 1200;

export default function ClipGenerator() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [stage, setStage] = useState<Stage>("queued");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClipResult | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, []);

  function pollJob(jobId: string) {
    async function tick() {
      try {
        const res = await fetch(`/api/jobs/${jobId}`, { cache: "no-store" });
        const data = (await res.json()) as JobResponse;

        if (!res.ok) {
          setError(data.error ?? "Úlohu se nepodařilo najít.");
          setStatus("error");
          return;
        }

        setStage(data.stage);
        setProgress(data.progress);

        if (data.stage === "error") {
          setError(data.error ?? "Zpracování videa selhalo.");
          setStatus("error");
          return;
        }

        if (data.stage === "done" && data.downloadUrl) {
          setResult({
            title: data.title ?? "Video bez názvu",
            authorName: data.authorName ?? "Neznámý autor",
            downloadUrl: data.downloadUrl,
            captions: data.highlight?.captions.map((c) => c.text) ?? [],
          });
          setStatus("done");
          return;
        }

        pollTimer.current = setTimeout(tick, POLL_INTERVAL_MS);
      } catch {
        setError("Ztraceno spojení se serverem. Zkus to prosím znovu.");
        setStatus("error");
      }
    }

    tick();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isYouTubeUrl(url)) {
      setError("Tohle nevypadá jako platný odkaz na YouTube video.");
      setStatus("error");
      return;
    }

    setStatus("starting");
    setResult(null);
    setProgress(0);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Video se nepodařilo zpracovat.");
        setStatus("error");
        return;
      }

      setStatus("processing");
      setStage("queued");
      pollJob(data.jobId);
    } catch {
      setError("Něco se pokazilo. Zkus to prosím znovu.");
      setStatus("error");
    }
  }

  function reset() {
    if (pollTimer.current) clearTimeout(pollTimer.current);
    setStatus("idle");
    setResult(null);
    setError(null);
    setUrl("");
    setProgress(0);
  }

  const isBusy = status === "starting" || status === "processing";

  return (
    <section id="vyzkouset" className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-card sm:p-8">
        {status !== "done" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={isBusy}
              className="flex-1 rounded-2xl border border-pink-100 bg-pink-50/40 px-5 py-3.5 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isBusy || url.trim() === ""}
              className="whitespace-nowrap rounded-2xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
            >
              {isBusy ? "Zpracovávám…" : "Vygenerovat sestřih"}
            </button>
          </form>
        )}

        {status === "error" && error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {isBusy && (
          <div className="mt-6">
            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-pink-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-500 transition-all duration-500"
                style={{ width: `${Math.max(6, progress)}%` }}
              />
            </div>
            <p className="text-sm font-medium text-foreground/60">
              {status === "starting" ? "Připravuji úlohu…" : STAGE_LABELS[stage]}
            </p>
          </div>
        )}

        {status === "done" && result && <ResultCard result={result} onReset={reset} />}
      </div>

      <p className="mt-4 text-center text-xs text-foreground/40">
        Zpracování reálně stahuje video z YouTube, přepisuje řeč a vypaluje
        titulky na serveru — u delších videí to může trvat i několik minut.
      </p>
    </section>
  );
}
