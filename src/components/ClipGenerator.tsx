"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { isYouTubeUrl } from "@/lib/youtube";
import ResultCard, { type ClipResult } from "@/components/ResultCard";

type Status = "idle" | "loading" | "processing" | "done" | "error";

const PROCESSING_STEPS = [
  "Stahuji video…",
  "Hledám nejzajímavější moment…",
  "Generuji titulky…",
  "Skládám finální klip…",
];

const MOCK_CAPTIONS = [
  "Tohle je moment, kdy se to celé zlomilo.",
  "Nikdo nevěřil, že by to mohlo vyjít.",
  "A pak se stalo něco, co nikdo nečekal.",
  "Přesně kvůli tomuhle to video sleduju.",
];

export default function ClipGenerator() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClipResult | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach(clearTimeout);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isYouTubeUrl(url)) {
      setError("Tohle nevypadá jako platný odkaz na YouTube video.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setResult(null);

    try {
      const res = await fetch(`/api/oembed?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Video se nepodařilo načíst.");
        setStatus("error");
        return;
      }

      setStatus("processing");
      setStepIndex(0);

      PROCESSING_STEPS.forEach((_, i) => {
        const t = setTimeout(() => setStepIndex(i), i * 700);
        timers.current.push(t);
      });

      const finalTimer = setTimeout(() => {
        setResult({
          title: data.title,
          authorName: data.authorName,
          thumbnailUrl: data.thumbnailUrl,
          videoId: data.videoId,
          captions: MOCK_CAPTIONS,
        });
        setStatus("done");
      }, PROCESSING_STEPS.length * 700 + 500);
      timers.current.push(finalTimer);
    } catch {
      setError("Něco se pokazilo. Zkus to prosím znovu.");
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setError(null);
    setUrl("");
  }

  const isBusy = status === "loading" || status === "processing";

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
              <div className="relative h-full w-full">
                <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-brand-400 to-brand-500 animate-shimmer" />
              </div>
            </div>
            <p className="text-sm font-medium text-foreground/60">
              {status === "loading" ? "Načítám video…" : PROCESSING_STEPS[stepIndex]}
            </p>
          </div>
        )}

        {status === "done" && result && (
          <ResultCard result={result} onReset={reset} />
        )}
      </div>

      <p className="mt-4 text-center text-xs text-foreground/40">
        Ukázka rozhraní — reálné stříhání videa a přepis řeči zatím nejsou
        napojené na video engine.
      </p>
    </section>
  );
}
