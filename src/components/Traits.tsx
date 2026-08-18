import { collectionCopy, collectionLayers, collectionStats } from '../data/lore'

export function Traits() {
  return (
    <section
      id="traits"
      aria-labelledby="collection-heading"
      className="collection-section content-auto relative overflow-hidden px-4 py-16 md:px-8 md:py-24"
    >
      <div aria-hidden className="collection-section-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1180px]">
        <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:hidden">
          {collectionStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/55 bg-white/70 px-3 py-3 text-center"
            >
              <p className="font-display text-2xl text-ink">{stat.value}</p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-ink-soft">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <figure className="collection-infographic relative">
          <div className="relative overflow-hidden rounded-[1.25rem] border border-white/70 bg-white/50 shadow-[0_20px_50px_rgba(47,74,155,0.1)] md:rounded-[1.75rem]">
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet="/assets/trait-900.webp"
                type="image/webp"
              />
              <img
                src="/assets/trait-1600.webp"
                alt="Luxora collection infographic — 120 traits, 7 layers, 320 million combinations, with trait breakdown and rarity tiers"
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </picture>
          </div>
        </figure>

        <div id="collection-heading" className="sr-only">
          <h2>{collectionCopy.headline}</h2>
          <p>{collectionCopy.body}</p>
          <p>{collectionCopy.rarityLine}</p>
          <ul>
            {collectionStats.map((s) => (
              <li key={s.label}>
                {s.value} {s.label}
              </li>
            ))}
          </ul>
          <ul>
            {collectionLayers.map((layer) => (
              <li key={layer.key}>{layer.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
