# StřihAI

Ukázková webová aplikace v Lovable stylu (růžovo-bílé rozhraní), inspirovaná
nástroji jako Opus Clip: uživatel vloží odkaz na YouTube video a aplikace
"vygeneruje" 15sekundový sestřih s vypálenými titulky.

## Stav projektu

Toto je **funkční UI/demo**:

- Formulář reálně ověří a načte YouTube video (název, kanál, náhledový
  obrázek) přes veřejné YouTube oEmbed API (`/api/oembed`).
- Průběh zpracování (stahování, hledání nejlepšího momentu, generování
  titulků) je simulovaný animovaným progressem.
- Výsledná obrazovka zobrazuje mockup klipu ve formátu 9:16 s ukázkovými
  (mock) titulky, které se cyklicky střídají přes náhledový obrázek videa.
- Tlačítko „Stáhnout klip“ je záměrně neaktivní — reálné stříhání videa
  (yt-dlp/ffmpeg) a přepis řeči (např. whisper.cpp) zatím nejsou napojené.

## Vývoj

```bash
npm install
npm run dev
```

Aplikace poběží na `http://localhost:3000`.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- `/api/oembed` — server-side route volající veřejné YouTube oEmbed API

## Další kroky (napojení reálného zpracování)

1. Backend job engine (queue + worker), který video stáhne přes `yt-dlp`.
2. Přepis řeči (např. `whisper.cpp` lokálně, nebo Whisper API) pro reálné
   titulky s časováním.
3. Logika výběru "nejzajímavějšího" úseku (heuristika nad transkriptem,
   případně LLM).
4. Sestřih a vypálení titulků přes `ffmpeg`, uložení výstupu a zpřístupnění
   ke stažení.
