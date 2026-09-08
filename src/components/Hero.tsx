export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-grid-fade pb-8 pt-20 md:pt-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-semibold text-brand-600 shadow-card">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Z dlouhého videa krátký virální klip
        </span>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Vlož YouTube odkaz,
          <br />
          dostaneš <span className="text-gradient-brand">15sekundový sestřih</span>
          <br />
          s titulky.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-foreground/60">
          StřihAI najde nejzajímavější moment ve videu, vystřihne ho a rovnou
          vypálí titulky — jako Opus Clip, jen růžovější.
        </p>
      </div>
    </section>
  );
}
