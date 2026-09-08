"use client";

import Image from "next/image";

export interface ClipResult {
  title: string;
  authorName: string;
  thumbnailUrl: string;
  videoId: string;
  captions: string[];
}

export default function ResultCard({
  result,
  onReset,
}: {
  result: ClipResult;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="relative aspect-[9/16] w-56 shrink-0 overflow-hidden rounded-2xl bg-black shadow-soft">
        <Image
          src={result.thumbnailUrl}
          alt={result.title}
          fill
          sizes="224px"
          className="scale-125 object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />

        <span className="absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          Nejlepší moment
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white">
          0:00–0:15
        </span>

        <div className="absolute inset-x-3 bottom-4 flex h-10 items-center justify-center text-center">
          {result.captions.map((caption, i) => (
            <span
              key={i}
              style={{ animationDelay: `${i * 3.2}s` }}
              className="absolute rounded-lg bg-black/60 px-3 py-1.5 text-[13px] font-bold leading-snug text-white opacity-0 [animation:caption-cycle_12.8s_ease-in-out_infinite]"
            >
              {caption}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
            Hotovo
          </p>
          <h3 className="mt-1 text-lg font-bold leading-snug text-foreground">
            {result.title}
          </h3>
          <p className="mt-1 text-sm text-foreground/50">{result.authorName}</p>
        </div>

        <ul className="space-y-2 text-sm text-foreground/70">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Délka: 15 s,
            formát 9:16
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Titulky
            vypálené do videa
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Vybráno
            automaticky jako nejzajímavější úsek
          </li>
        </ul>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            title="Stažení bude dostupné po napojení video enginu"
            disabled
            className="cursor-not-allowed rounded-xl bg-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-800/70"
          >
            Stáhnout klip
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-pink-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-pink-50"
          >
            Zkusit jiné video
          </button>
        </div>
      </div>
    </div>
  );
}
