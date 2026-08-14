import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'

export function WatchingEye() {
  const x = useMotionValue(-40)
  const y = useMotionValue(-40)
  const pupilX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.4 })
  const pupilY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.4 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth - 56
      const cy = window.innerHeight - 56
      const dx = (e.clientX - cx) / window.innerWidth
      const dy = (e.clientY - cy) / window.innerHeight
      x.set(Math.max(-10, Math.min(10, dx * 28)))
      y.set(Math.max(-8, Math.min(8, dy * 22)))
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-5 right-5 z-[60] hidden sm:block md:bottom-8 md:right-8"
    >
      <div className="relative h-16 w-16 md:h-[4.5rem] md:w-[4.5rem]">
        <div className="absolute inset-0 rounded-full bg-gold/25 blur-xl" />
        <div className="glass-strong relative flex h-full w-full items-center justify-center overflow-hidden rounded-full shadow-[0_12px_40px_rgba(26,22,48,0.25)]">
          <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-cream via-[#f3e6c8] to-[#d8c089]" />
          <motion.div
            style={{ x: pupilX, y: pupilY }}
            className="relative z-10 h-7 w-7 rounded-full md:h-8 md:w-8"
          >
            <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_35%_30%,#e8c56a,#8b5a14_55%,#1a1630_78%)] shadow-inner">
              <div className="absolute left-[28%] top-[22%] h-2 w-2 rounded-full bg-cream/80" />
            </div>
          </motion.div>
          <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-gold/40" />
        </div>
      </div>
    </div>
  )
}
