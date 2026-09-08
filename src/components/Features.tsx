const FEATURES = [
  {
    icon: "✂️",
    title: "Automatický výběr momentu",
    description:
      "Žádné ruční hledání v timeline — systém sám najde nejzajímavějších 15 sekund videa.",
  },
  {
    icon: "💬",
    title: "Titulky rovnou ve videu",
    description: "Přepis řeči se vypálí přímo do klipu, takže funguje i bez zvuku.",
  },
  {
    icon: "📱",
    title: "Formát na výšku",
    description: "Výstup ve 9:16 připravený rovnou pro TikTok, Reels i Shorts.",
  },
  {
    icon: "⚡",
    title: "Rychlé jako blesk",
    description: "Stačí vložit odkaz — o zbytek se postará StřihAI za tebe.",
  },
];

export default function Features() {
  return (
    <section id="funkce" className="bg-pink-50/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Vše, co potřebuješ pro <span className="text-gradient-brand">virální klip</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="mt-4 font-bold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-foreground/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
