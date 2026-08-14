import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export function Hero() {
  const [allowMotion, setAllowMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (min-aspect-ratio: 4/5)')
    const update = () => setAllowMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 800], [0, 140])
  const imageScale = useTransform(scrollY, [0, 800], [1, 1.08])
  const fade = useTransform(scrollY, [0, 480], [1, 0])
  const ctaY = useTransform(scrollY, [0, 480], [0, 48])

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Matches hero edges when image is letterboxed on tall screens */}
      <div
        aria-hidden
        className="hero-backdrop absolute inset-0"
      />

      <motion.div
        style={{
          y: allowMotion ? imageY : 0,
          scale: allowMotion ? imageScale : 1,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <picture className="flex h-full w-full items-center justify-center">
          <source
            media="(max-width: 640px)"
            srcSet="/assets/hero-800.webp"
            type="image/webp"
          />
          <source
            media="(max-width: 1280px)"
            srcSet="/assets/hero-1600.webp"
            type="image/webp"
          />
          <img
            src="/assets/hero-3200.webp"
            srcSet="/assets/hero-800.webp 800w, /assets/hero-1600.webp 1600w, /assets/hero-3200.webp 3200w"
            sizes="100vw"
            alt="Luxora — Born from clouds. Carrying light."
            className="hero-img h-full w-full max-h-[100svh] object-contain object-center md:object-cover md:object-[center_42%]"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#1a1630]/50 to-transparent" />
      </motion.div>

      <h1 className="sr-only">Luxora — Born from clouds. Carrying light.</h1>

      <motion.div
        style={{ opacity: fade, y: ctaY }}
        className="relative z-10 w-full px-5 pb-12 pt-28 md:px-10 md:pb-16"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <motion.a
            href="#gallery"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong rounded-full px-7 py-3 text-sm font-medium tracking-wide text-ink transition hover:scale-[1.03]"
          >
            Enter the Gallery
          </motion.a>
          <motion.a
            href="#featured"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-full border border-cream/45 bg-ink/20 px-7 py-3 text-sm font-medium tracking-wide text-cream backdrop-blur-md transition hover:bg-ink/35"
          >
            Featured Relics
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}
