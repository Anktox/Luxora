import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const clouds = [
  { left: '6%', top: '12%', size: 220, blur: 28, opacity: 0.35, speed: 80 },
  { left: '72%', top: '8%', size: 280, blur: 36, opacity: 0.28, speed: 120 },
  { left: '18%', top: '58%', size: 260, blur: 40, opacity: 0.22, speed: 160 },
  { left: '58%', top: '62%', size: 200, blur: 30, opacity: 0.3, speed: 100 },
  { left: '40%', top: '28%', size: 160, blur: 24, opacity: 0.18, speed: 60 },
]

export function CloudField() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const drift = useTransform(scrollYProgress, [0, 1], [0, -220])

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
      <motion.div style={{ y: drift }} className="absolute inset-0">
        {clouds.map((cloud, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: cloud.left,
              top: cloud.top,
              width: cloud.size,
              height: cloud.size * 0.62,
              opacity: cloud.opacity,
              filter: `blur(${cloud.blur}px)`,
              background:
                'radial-gradient(ellipse at 40% 40%, rgba(255,252,245,0.95), rgba(232,197,106,0.25) 45%, transparent 70%)',
            }}
            animate={{ x: [0, cloud.speed * 0.15, 0], y: [0, i % 2 === 0 ? -18 : 14, 0] }}
            transition={{ duration: 14 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>
    </div>
  )
}
