import { worldCopy } from '../data/lore'

export function World() {
  return (
    <section id="world" className="content-auto relative overflow-hidden px-5 py-24 md:px-10 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,197,106,0.28),transparent_70%)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-royal-soft">
            {worldCopy.eyebrow}
          </p>
          <h2 className="font-display mt-4 text-4xl leading-[1.05] text-ink md:text-6xl">
            {worldCopy.title}
          </h2>
          <div className="mt-6 space-y-4">
            {worldCopy.paragraphs.map((p) => (
              <p key={p} className="max-w-xl text-base font-light leading-relaxed text-ink-soft md:text-lg">
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="glass-lite relative overflow-hidden rounded-[1.8rem] p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">The refrain</p>
          <ul className="mt-6 space-y-5">
            {worldCopy.refrain.map((line) => (
              <li key={line} className="font-display text-2xl leading-snug text-ink md:text-3xl">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
