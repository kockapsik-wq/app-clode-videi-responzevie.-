const STEPS = [
  {
    number: "1",
    title: "Vlož odkaz",
    description: "Zkopíruj odkaz na YouTube video, které chceš proměnit v krátký klip.",
  },
  {
    number: "2",
    title: "AI najde highlight",
    description:
      "Systém projede celé video, najde nejzajímavějších 15 sekund a připraví přepis řeči.",
  },
  {
    number: "3",
    title: "Titulky se vypálí",
    description: "Titulky se automaticky vloží přímo do videa ve formátu na výšku.",
  },
  {
    number: "4",
    title: "Stáhni a sdílej",
    description: "Klip je hotový ke stažení a nahrání na TikTok, Reels nebo Shorts.",
  },
];

export default function HowItWorks() {
  return (
    <section id="jak-to-funguje" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Jak to <span className="text-gradient-brand">funguje</span>
        </h2>
        <p className="mt-3 text-foreground/60">
          Čtyři kroky mezi dlouhým videem a klipem připraveným na sdílení.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="relative rounded-2xl border border-pink-100 bg-white p-6 shadow-card"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white">
              {step.number}
            </span>
            <h3 className="mt-4 font-bold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm text-foreground/60">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
