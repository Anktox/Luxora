export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden">
      <div aria-hidden className="hero-backdrop absolute inset-0" />

      <div className="absolute inset-0">
        <picture className="block h-full w-full">
          <source
            media="(max-width: 767px)"
            srcSet="/assets/vitical-720.webp 720w, /assets/vitical-1080.webp 1080w"
            sizes="100vw"
            type="image/webp"
          />
          <source
            media="(min-width: 768px)"
            srcSet="/assets/hero-800.webp 800w, /assets/hero-1600.webp 1600w, /assets/hero-3200.webp 3200w"
            sizes="100vw"
            type="image/webp"
          />
          <img
            src="/assets/hero-1600.webp"
            alt="Luxora — Born from clouds. Carrying light."
            className="hero-img h-full w-full"
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-[#1a1630]/55 to-transparent md:h-[28%] md:from-[#1a1630]/50" />
      </div>

      <h1 className="sr-only">Luxora — Born from clouds. Carrying light.</h1>

      <div className="relative z-10 w-full px-5 pb-10 pt-28 md:px-10 md:pb-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <a
            href="#gallery"
            className="glass-lite rounded-full px-7 py-3 text-sm font-medium tracking-wide text-ink"
          >
            Enter the Gallery
          </a>
          <a
            href="#featured"
            className="rounded-full border border-cream/45 bg-ink/30 px-7 py-3 text-sm font-medium tracking-wide text-cream"
          >
            Featured Relics
          </a>
        </div>
      </div>
    </section>
  )
}
