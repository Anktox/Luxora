import { motion } from 'framer-motion'

export function LookCloser() {
  return (
    <section id="closer" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem]">
        <img
          src="/assets/hero.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1630]/75 via-[#1a1630]/35 to-[#1a1630]/25" />

        <div className="relative flex min-h-[52svh] flex-col items-center justify-center px-6 py-20 text-center md:min-h-[58svh]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.35em] text-cream/75"
          >
            The world of Luxora is only beginning
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display mt-4 text-5xl tracking-[0.06em] text-cream md:text-7xl"
          >
            LOOK CLOSER.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-4 max-w-lg text-base font-light text-cream/85 md:text-lg"
          >
            There is more to Luxora than what you see at first glance.
          </motion.p>
          <motion.a
            href="#gallery"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.32, duration: 0.65 }}
            className="mt-8 rounded-full bg-cream px-7 py-3 text-sm font-medium tracking-wide text-ink transition hover:bg-gold-bright"
          >
            Explore Luxora
          </motion.a>
        </div>
      </div>
    </section>
  )
}
