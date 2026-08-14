import { AnimatePresence, motion, useScroll, useTransform, type PanInfo } from 'framer-motion'
import { useRef, useState } from 'react'
import { heroPieces } from '../data/nfts'
import type { Nft } from '../data/nfts'

type Props = {
  onSelect: (nft: Nft) => void
}

const STACK_OFFSETS = [
  { rotate: 0, y: 0, x: 0, scale: 1 },
  { rotate: -5, y: 16, x: -10, scale: 0.96 },
  { rotate: 4.5, y: 32, x: 12, scale: 0.92 },
]

function shuffle<T>(items: T[]) {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export function Featured({ onSelect }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const rotateY = useTransform(scrollYProgress, [0.15, 0.85], [-12, 12])
  const depth = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [40, 0, -40])

  const [deck] = useState(() => shuffle(heroPieces))

  return (
    <section id="featured" ref={ref} className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl md:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-royal-soft">
            First Glimpses
          </p>
          <h2 className="font-display mt-3 text-4xl leading-tight text-ink md:text-6xl">
            They simply appeared.
          </h2>
          <p className="mt-4 text-base font-light text-ink-soft md:text-lg">
            Early faces from above the clouds — eyes, charms, and vessels of light that hint at the
            full 10,000.
          </p>
        </div>

        <div className="md:hidden">
          <FeaturedStack deck={deck} onSelect={onSelect} />
          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            Swipe to reveal the next
          </p>
        </div>

        <div
          className="relative hidden md:block"
          style={{ perspective: '1400px', perspectiveOrigin: '50% 45%' }}
        >
          <motion.div
            style={{ rotateY, y: depth, transformStyle: 'preserve-3d' }}
            className="grid gap-6 md:grid-cols-3"
          >
            {heroPieces.map((nft, index) => (
              <FeaturedCard key={nft.id} nft={nft} index={index} onSelect={onSelect} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FeaturedStack({ deck, onSelect }: { deck: Nft[]; onSelect: (nft: Nft) => void }) {
  const [cursor, setCursor] = useState(0)
  const [exitX, setExitX] = useState(0)

  const top = deck[cursor % deck.length]
  const mid = deck[(cursor + 1) % deck.length]
  const bot = deck[(cursor + 2) % deck.length]

  const dismiss = (direction: 1 | -1) => {
    setExitX(direction * 320)
    setCursor((c) => (c + 1) % deck.length)
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 80) dismiss(-1)
    else if (info.offset.x < -80) dismiss(1)
  }

  return (
    <div className="relative mx-auto h-[min(72vw+88px,420px)] w-full max-w-[340px] touch-pan-y">
      {[bot, mid].map((nft, i) => {
        const stackIndex = i + 1
        const offset = STACK_OFFSETS[stackIndex]
        return (
          <motion.div
            key={`${nft.id}-back-${stackIndex}`}
            className="pointer-events-none absolute inset-x-0 top-0 origin-top"
            style={{ zIndex: stackIndex }}
            animate={{
              x: offset.x,
              y: offset.y,
              rotate: offset.rotate,
              scale: offset.scale,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            <FeaturedCard nft={nft} stackMode onSelect={onSelect} />
          </motion.div>
        )
      })}

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={`${top.id}-${cursor}`}
          className="absolute inset-x-0 top-0 origin-top"
          style={{ zIndex: 10 }}
          initial={{ x: exitX, opacity: 0, rotate: 0, scale: 0.98 }}
          animate={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
          exit={{ x: exitX, opacity: 0, rotate: exitX * 0.05, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.85}
          onDragEnd={onDragEnd}
          whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
        >
          <FeaturedCard nft={top} stackMode onSelect={onSelect} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function FeaturedCard({
  nft,
  index,
  stackMode,
  onSelect,
}: {
  nft: Nft
  index?: number
  stackMode?: boolean
  onSelect: (nft: Nft) => void
}) {
  const z = index === 1 ? 60 : index === 0 ? 20 : 10
  const tilt = index === 0 ? -8 : index === 2 ? 8 : 0

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(nft)}
      initial={stackMode ? false : { opacity: 0, y: 40 }}
      whileInView={stackMode ? undefined : { opacity: 1, y: 0 }}
      viewport={stackMode ? undefined : { once: true, amount: 0.35 }}
      transition={
        stackMode
          ? undefined
          : { delay: (index ?? 0) * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
      }
      whileHover={stackMode ? undefined : { y: -10, scale: 1.02 }}
      className={`group relative w-full text-left ${stackMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={
        stackMode
          ? undefined
          : {
              transform: `translateZ(${z}px) rotateY(${tilt}deg)`,
              transformStyle: 'preserve-3d',
            }
      }
    >
      <div className="glass overflow-hidden rounded-[1.6rem] p-3 shadow-[0_20px_50px_rgba(26,22,48,0.12)] md:p-4">
        <div className="overflow-hidden rounded-[1.15rem] bg-gradient-to-br from-cream/40 to-sky/30">
          <img
            src={nft.src}
            alt={nft.title}
            loading="lazy"
            draggable={false}
            className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex items-end justify-between gap-3 px-2 pb-1 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-royal-soft">{nft.vibe}</p>
            <h3 className="font-display mt-1 text-2xl text-ink">{nft.title}</h3>
          </div>
          <span className="text-xs tracking-wider text-ink-soft">{nft.edition}</span>
        </div>
      </div>
    </motion.button>
  )
}
