import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { collectionCopy, collectionLayers, collectionStats } from '../data/lore'

export function Traits() {
  const ref = useRef<HTMLElement>(null)
  const [activeLayer, setActiveLayer] = useState<number | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const stackRotate = useTransform(scrollYProgress, [0.15, 0.55, 0.85], [14, 0, -8])
  const stackY = useTransform(scrollYProgress, [0.1, 0.6], [80, -20])
  const glowScale = useTransform(scrollYProgress, [0.2, 0.6], [0.85, 1.15])

  return (
    <section
      id="traits"
      ref={ref}
      className="relative overflow-hidden px-5 py-24 md:px-10 md:py-32"
    >
      {/* Section atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(47,74,155,0.12),transparent_60%)]"
      />
      <motion.div
        aria-hidden
        style={{ scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,197,106,0.18),transparent_68%)] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 max-w-3xl md:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex rounded-full border border-gold/35 bg-gold/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-gold"
          >
            {collectionCopy.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="font-display mt-5 text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1.05] text-ink"
          >
            {collectionCopy.headline}
          </motion.h2>
        </div>

        {/* Stats */}
        <div className="mb-12 grid grid-cols-2 gap-3 md:mb-16 md:grid-cols-4 md:gap-4">
          {collectionStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.55 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative overflow-hidden rounded-[1.4rem] border border-white/50 bg-white/25 p-5 shadow-[0_16px_48px_rgba(26,22,48,0.08)] backdrop-blur-xl md:p-6"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 transition duration-500 group-hover:opacity-100`}
              />
              <div className="relative">
                <p className="font-display text-4xl text-ink md:text-5xl">{stat.value}</p>
                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.24em] text-ink-soft md:text-[11px]">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main visual: 3D layer stack + copy */}
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          {/* Layer stack */}
          <motion.div
            style={{ rotateX: stackRotate, y: stackY, perspective: 1200, transformStyle: 'preserve-3d' }}
            className="relative mx-auto aspect-square w-full max-w-[420px] lg:max-w-none"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {collectionLayers.map((layer, i) => {
                const isActive = activeLayer === i
                const isDimmed = activeLayer !== null && !isActive
                const zOffset = i * 28
                const xOffset = i * 6
                const rotate = -6 + i * 2.2

                return (
                  <motion.button
                    key={layer.key}
                    type="button"
                    onMouseEnter={() => setActiveLayer(i)}
                    onMouseLeave={() => setActiveLayer(null)}
                    onFocus={() => setActiveLayer(i)}
                    onBlur={() => setActiveLayer(null)}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.55 }}
                    animate={{
                      y: isActive ? zOffset - 18 : zOffset,
                      x: isActive ? xOffset + 12 : xOffset,
                      rotateZ: isActive ? rotate + 2 : rotate,
                      scale: isActive ? 1.04 : 1,
                      opacity: isDimmed ? 0.45 : 1,
                    }}
                    className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    style={{
                      zIndex: i + 1,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div
                      className={`relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br ${layer.tint} shadow-[0_20px_60px_rgba(26,22,48,0.15)] backdrop-blur-xl transition-shadow duration-500`}
                      style={{
                        boxShadow: isActive
                          ? `0 28px 70px ${layer.glow}, inset 0 1px 0 rgba(255,255,255,0.7)`
                          : undefined,
                      }}
                    >
                      <div className="flex items-center gap-4 p-3 md:p-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/50 md:h-16 md:w-16">
                          <img
                            src={layer.preview}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover object-top"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="font-display text-xl text-ink md:text-2xl">{layer.name}</p>
                            <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
                              L{layer.order}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] tracking-wide text-ink-soft">{layer.rarity}</p>
                        </div>
                      </div>
                      <div className="h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-60" />
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Center glow behind stack */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 blur-3xl" />
          </motion.div>

          {/* Copy + rarity */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="glass-strong rounded-[1.8rem] p-6 md:p-8"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-royal-soft">How it&apos;s built</p>
              <p className="mt-4 text-base font-light leading-relaxed text-ink-soft md:text-lg">
                {collectionCopy.body}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {collectionLayers.map((layer) => (
                  <span
                    key={layer.key}
                    className="rounded-full border border-white/45 bg-white/30 px-3 py-1 text-[11px] font-medium tracking-wide text-ink-soft backdrop-blur-sm"
                  >
                    {layer.name}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.65 }}
              className="relative overflow-hidden rounded-[1.6rem] border border-gold/35 bg-gradient-to-br from-[#1a1630]/90 via-[#2f4a9b]/75 to-[#1a1630]/90 p-6 text-cream shadow-[0_24px_60px_rgba(26,22,48,0.25)] md:p-8"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-royal-soft/25 blur-2xl" />
              <p className="relative font-display text-2xl leading-snug md:text-3xl">
                &ldquo;{collectionCopy.rarityLine}&rdquo;
              </p>
              <div className="relative mt-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-gold/60 to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold-bright">Rarity</span>
              </div>
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
