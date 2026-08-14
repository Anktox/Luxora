export function Footer() {
  return (
    <footer className="relative px-5 pb-10 pt-4 md:px-10">
      <div className="glass mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-[1.6rem] px-6 py-8 md:flex-row md:items-center md:px-8">
        <div>
          <p className="font-display text-3xl tracking-[0.08em] text-ink">LUXORA</p>
          <p className="mt-2 max-w-md text-sm font-light text-ink-soft">
            Born from clouds. Carrying light. Beautiful enough to collect. Useful enough to keep.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft">
          <a href="#world" className="transition hover:text-ink">
            World
          </a>
          <a href="#traits" className="transition hover:text-ink">
            Traits
          </a>
          <a href="#light" className="transition hover:text-ink">
            The Light
          </a>
          <a href="#roadmap" className="transition hover:text-ink">
            Roadmap
          </a>
          <a href="#top" className="transition hover:text-ink">
            Top
          </a>
        </div>
      </div>
    </footer>
  )
}
