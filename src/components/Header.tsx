export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-pink-100/80 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white shadow-soft">
            S
          </span>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            Střih<span className="text-brand-500">AI</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/70 md:flex">
          <a href="#jak-to-funguje" className="transition hover:text-brand-600">
            Jak to funguje
          </a>
          <a href="#funkce" className="transition hover:text-brand-600">
            Funkce
          </a>
          <a href="#vyzkouset" className="transition hover:text-brand-600">
            Vyzkoušet
          </a>
        </nav>

        <a
          href="#vyzkouset"
          className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600"
        >
          Vyzkoušet zdarma
        </a>
      </div>
    </header>
  );
}
