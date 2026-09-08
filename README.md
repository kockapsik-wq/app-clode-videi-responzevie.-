# StřihAI

Webová aplikace v Lovable stylu (růžovo-bílé rozhraní), inspirovaná nástroji
jako Opus Clip: uživatel vloží odkaz na YouTube video a aplikace z něj
reálně vytvoří 15sekundový sestřih ve formátu 9:16 s vypálenými titulky.

## Jak to funguje (reálný pipeline)

1. **Stažení** — `yt-dlp` stáhne video z YouTube (max 720p, max 30 minut).
2. **Přepis řeči** — zvuk se přes `ffmpeg` převede na 16kHz mono WAV a
   pošle do `whisper.cpp`, který ho lokálně přepíše na text s časováním.
3. **Výběr nejlepšího momentu** — jednoduchá heuristika projede přepis a
   najde 15sekundové okno s nejvyšším "skóre" (hustota slov, vykřičníky,
   otazníky, klíčová slova jako „neuvěřitelné", „wow" apod.).
4. **Sestřih a titulky** — `ffmpeg` vystřihne vybraný úsek, převede ho na
   formát 9:16 (ostré video uprostřed + rozostřené pozadí z téhož záběru) a
   vypálí do něj titulky v brandových barvách (růžový box, bílý tučný text).
5. Hotový klip se stáhne přes `/api/jobs/[id]/download`.

Frontend (`ClipGenerator`) úlohu založí přes `POST /api/jobs`, a dokud
neskončí, každou ~1,2 s ji pollingem kontroluje přes `GET /api/jobs/[id]`.

## Instalace systémových závislostí

Appka spouští na serveru externí binárky, takže kromě `npm install`
potřebuje i:

```bash
npm install

# ffmpeg + yt-dlp (potřebuje sudo/root a internet)
npm run setup:system

# zkompiluje whisper.cpp a stáhne AI model pro přepis řeči
# (potřebuje internet — huggingface.co musí být dostupné)
npm run setup:whisper        # výchozí model "base"
# npm run setup:whisper -- small   # přesnější, ale pomalejší model
```

Skript `setup:whisper` na konci vypíše cesty, které je potřeba nastavit v
`.env` (zkopíruj z `.env.example`):

```bash
cp .env.example .env
# doplň WHISPER_CPP_BIN a WHISPER_MODEL_PATH podle výstupu setup:whisper
```

## Vývoj

```bash
npm run dev
```

Aplikace poběží na `http://localhost:3000`.

## Nasazení — důležité

Tohle **není** aplikace pro čistě serverless/edge platformy (např. Vercel
Edge Functions) — potřebuje běžící Node.js server s trvalým diskem, na
kterém jsou nainstalované `ffmpeg`, `yt-dlp` a zkompilovaný `whisper-cli` s
modelem. Hodí se např. na VPS, Docker kontejner, Railway, Render nebo
Fly.io. Zpracování jednoho videa může trvat desítky sekund až jednotky
minut podle délky videa a výkonu serveru (přepis řeči běží na CPU).

Úlohy se aktuálně drží v paměti procesu (žádná databáze) — při restartu
serveru se rozpracované/dokončené úlohy ztratí. Pro provoz s více
instancemi by bylo potřeba sdílenou frontu a úložiště.

### Nasazení přes Docker (Railway, Render, Fly.io, VPS…)

V repozitáři je `Dockerfile`, který v build kroku sám zkompiluje
whisper.cpp, stáhne AI model a nainstaluje ffmpeg/yt-dlp — není potřeba nic
ručně připravovat, jen mít platformu, která umí nasadit `Dockerfile` z
GitHub repozitáře a naslouchá na proměnné prostředí `PORT`.

```bash
docker build -t strihai .
docker run -p 3000:3000 strihai
```

Build stahuje ~150MB AI model, takže první sestavení trvá déle (v řádu
minut). Sandbox, ve kterém appka vznikla, blokuje přístup na
huggingface.co i Docker Hub, takže build nešlo ověřit end-to-end přímo
tady — na běžné nasazovací platformě s normálním internetem by ale měl
projít bez zásahu.

## Právní upozornění

Stahuj a stříhej pouze videa, ke kterým máš práva nebo odpovídající
licenci/svolení. Respektuj podmínky použití YouTube a autorská práva
tvůrců obsahu.

## Tech stack

- Next.js (App Router) + TypeScript, Tailwind CSS v4
- `yt-dlp`, `ffmpeg` (+ `libass` pro titulky), `whisper.cpp`
- `src/server/` — orchestrace úloh (`pipeline.ts`), jednotlivé kroky
  (`ytdlp.ts`, `whisper.ts`, `highlight.ts`, `ffmpegRender.ts`) a
  in-memory job store (`jobStore.ts`)
- `src/app/api/jobs/` — REST-ish API (vytvoření úlohy, stav, stažení)
