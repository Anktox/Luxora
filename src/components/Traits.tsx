import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { collectionCopy, collectionLayers, collectionStats } from '../data/lore'

export function Traits() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0.1, 0.75], [24, -24])
  const imageScale = useTransform(scrollYProgress, [0.15, 0.55, 0.85], [0.97, 1, 0.98])

  return (
    <section
      id="traits"
      ref={ref}
      aria-labelledby="collection-heading"
      className="collection-section relative overflow-hidden px-4 py-16 md:px-8 md:py-24"
    >
      <div aria-hidden className="collection-section-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1180px]">
        {/* Mobile-only quick stats — infographic text is small on narrow screens */}
        <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:hidden">
          {collectionStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              className="rounded-2xl border border-white/55 bg-white/35 px-3 py-3 text-center backdrop-blur-md"
            >
              <p className="font-display text-2xl text-ink">{stat.value}</p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-ink-soft">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.figure
          style={{ y: imageY, scale: imageScale }}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="collection-infographic relative"
        >
          <div className="collection-infographic-glow pointer-events-none absolute -inset-4 rounded-[2.5rem] md:-inset-6" />
          <div className="relative overflow-hidden rounded-[1.25rem] border border-white/70 bg-white/40 shadow-[0_28px_80px_rgba(47,74,155,0.14),0_8px_24px_rgba(26,22,48,0.06)] backdrop-blur-sm md:rounded-[1.75rem]">
            <img
              src="/assets/trait.png"
              alt="Luxora collection infographic — 120 traits, 7 layers, 320 million combinations, with trait breakdown and rarity tiers"
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
        </motion.figure>

        {/* Accessible copy for screen readers & SEO */}
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
