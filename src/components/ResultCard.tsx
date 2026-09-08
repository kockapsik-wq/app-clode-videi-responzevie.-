"use client";

export interface ClipResult {
  title: string;
  authorName: string;
  downloadUrl: string;
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
        <video
          src={result.downloadUrl}
          controls
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          Nejlepší moment
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white">
          15 s
        </span>
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

        {result.captions.length > 0 && (
          <div className="rounded-xl bg-pink-50/60 p-3 text-xs text-foreground/60">
            <p className="mb-1 font-semibold text-brand-600">Přepis titulků</p>
            <p className="leading-relaxed">{result.captions.join(" ")}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <a
            href={result.downloadUrl}
            download
            className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600"
          >
            Stáhnout klip
          </a>
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
