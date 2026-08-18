import { lightPillars, philosophy } from '../data/lore'

export function TheLight() {
  return (
    <section id="light" className="content-auto relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-royal-soft">The Light</p>
          <h2 className="font-display mt-3 text-4xl text-ink md:text-6xl">
            What turns Luxora from a collection into a world.
          </h2>
          <p className="mt-4 text-base font-light text-ink-soft md:text-lg">
            Every planned feature answers one question: why does owning a Luxora make this experience
            better?
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {lightPillars.map((pillar) => (
            <article
              key={pillar.name}
              className="glass-lite relative overflow-hidden rounded-[1.6rem] p-6 md:p-7"
            >
              <span className="inline-flex rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-gold">
                {pillar.status}
              </span>
              <h3 className="font-display mt-5 text-3xl text-ink">{pillar.name}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-ink-soft">{pillar.blurb}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
          {philosophy.map((item) => (
            <div
              key={item.num}
              className="rounded-[1.4rem] border border-white/50 bg-white/70 px-5 py-6"
            >
              <p className="text-xs tracking-[0.28em] text-gold">{item.num}</p>
              <h4 className="font-display mt-2 text-2xl text-ink">{item.name}</h4>
              <p className="mt-2 text-sm font-light text-ink-soft">{item.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
