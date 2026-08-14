import { motion, useScroll, useTransform } from 'framer-motion'

export function Hero() {
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 800], [0, 140])
  const imageScale = useTransform(scrollY, [0, 800], [1.04, 1.12])
  const fade = useTransform(scrollY, [0, 480], [1, 0])
  const ctaY = useTransform(scrollY, [0, 480], [0, 48])

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden">
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0">
        <img
          src="/assets/hero.png"
          alt="Luxora — Born from clouds. Carrying light."
          className="h-full w-full object-cover object-[center_42%]"
          fetchPriority="high"
        />
        <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#1a1630]/50 to-transparent" />
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
