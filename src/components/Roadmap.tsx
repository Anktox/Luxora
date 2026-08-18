import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { roadmap } from '../data/lore'

export function Roadmap() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.85], ['0%', '100%'])

  return (
    <section id="roadmap" ref={ref} className="content-auto relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-royal-soft">Roadmap</p>
          <h2 className="font-display mt-3 text-4xl text-ink md:text-6xl">Ascending through the clouds</h2>
          <p className="mt-4 text-base font-light text-ink-soft md:text-lg">
            No fake dates. Four phases — from awakening to whatever waits beyond the clouds.
          </p>
        </div>

        <div className="relative">
          <div className="absolute bottom-0 left-[1.15rem] top-2 w-px bg-ink/10 md:left-1/2 md:-translate-x-px" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[1.15rem] top-2 w-px origin-top bg-gradient-to-b from-gold via-royal-soft to-gold md:left-1/2 md:-translate-x-px"
          />

          <div className="space-y-8 md:space-y-12">
            {roadmap.map((step, i) => {
              const left = i % 2 === 0
              return (
                <motion.article
                  key={step.phase}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.6 }}
                  className={`relative grid gap-4 md:grid-cols-2 md:gap-16 ${left ? '' : 'md:[&>*:first-child]:order-2'}`}
                >
                  <div className={`${left ? 'md:text-right' : ''} pl-12 md:pl-0`}>
                    <div className="glass inline-block rounded-[1.5rem] p-5 text-left md:p-6">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
                        Phase {step.phase}
                      </p>
                      <h3 className="font-display mt-2 text-3xl text-ink">{step.name}</h3>
                      <p className="mt-2 text-sm font-medium text-royal-soft">{step.line}</p>
                      <ul className="mt-4 space-y-1.5">
                        {step.points.map((point) => (
                          <li key={point} className="text-sm font-light text-ink-soft">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute left-2 top-6 h-5 w-5 rounded-full border-2 border-gold bg-cream shadow-[0_0_20px_rgba(232,197,106,0.55)] md:left-1/2 md:-translate-x-1/2" />
                  <div className="hidden md:block" />
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
