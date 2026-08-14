import { motion, useScroll, useTransform } from 'framer-motion'

export function AmbientBackground() {
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -180])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 220])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 35])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full opacity-70"
      >
        <div
          className="h-full w-full rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(240,212,223,0.85) 0%, rgba(240,212,223,0) 70%)',
          }}
        />
      </motion.div>
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-16 top-[28%] h-[520px] w-[520px] rounded-full opacity-80"
      >
        <div
          className="h-full w-full rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(91,127,212,0.35) 0%, rgba(91,127,212,0) 68%)',
          }}
        />
      </motion.div>
      <div
        className="absolute bottom-[-10%] left-[30%] h-[480px] w-[480px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(232,197,106,0.28) 0%, rgba(232,197,106,0) 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(26,22,48,0.08) 0.6px, transparent 0.6px)',
          backgroundSize: '3px 3px',
        }}
      />
    </div>
  )
}
