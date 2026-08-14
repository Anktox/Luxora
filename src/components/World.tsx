import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { worldCopy } from '../data/lore'

export function World() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const glowY = useTransform(scrollYProgress, [0, 1], [60, -80])
  const mistX = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <section id="world" ref={ref} className="relative overflow-hidden px-5 py-24 md:px-10 md:py-32">
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(232,197,106,0.45),transparent_70%)]" />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ x: mistX }}
        className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55),transparent_70%)] blur-2xl"
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

        <div className="glass-strong relative overflow-hidden rounded-[1.8rem] p-6 md:p-8">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gold/20 blur-2xl" />
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">The refrain</p>
          <ul className="mt-6 space-y-5">
            {worldCopy.refrain.map((line, i) => (
              <motion.li
                key={line}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="font-display text-2xl leading-snug text-ink md:text-3xl"
              >
                {line}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
