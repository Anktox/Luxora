export function LookCloser() {
  return (
    <section id="closer" className="content-auto relative px-5 py-24 md:px-10 md:py-32">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem]">
        <img
          src="/assets/hero-800.webp"
          alt=""
          width={800}
          height={450}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1630]/75 via-[#1a1630]/35 to-[#1a1630]/25" />

        <div className="relative flex min-h-[52svh] flex-col items-center justify-center px-6 py-20 text-center md:min-h-[58svh]">
          <p className="text-xs uppercase tracking-[0.35em] text-cream/75">
            The world of Luxora is only beginning
          </p>
          <h2 className="font-display mt-4 text-5xl tracking-[0.06em] text-cream md:text-7xl">
            LOOK CLOSER.
          </h2>
          <p className="mt-4 max-w-lg text-base font-light text-cream/85 md:text-lg">
            There is more to Luxora than what you see at first glance.
          </p>
          <a
            href="#gallery"
            className="mt-8 rounded-full bg-cream px-7 py-3 text-sm font-medium tracking-wide text-ink"
          >
            Explore Luxora
          </a>
        </div>
      </div>
    </section>
  )
}
