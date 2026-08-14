import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useState } from 'react'
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

const DESKTOP_STACK_OFFSETS = [
  { rotate: 0, y: 0, x: 0, scale: 1 },
  { rotate: -4, y: 20, x: -14, scale: 0.965 },
  { rotate: 3.5, y: 40, x: 16, scale: 0.93 },
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
  const [deck] = useState(() => shuffle(heroPieces))

  return (
    <section id="featured" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl md:mb-12">
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

        <FeaturedStack deck={deck} onSelect={onSelect} />

        <p className="mt-5 text-center text-[11px] uppercase tracking-[0.22em] text-ink-soft">
          Swipe or drag to reveal the next
        </p>
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
    setExitX(direction * 360)
    setCursor((c) => (c + 1) % deck.length)
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 80) dismiss(-1)
    else if (info.offset.x < -80) dismiss(1)
  }

  return (
    <div className="relative mx-auto h-[min(72vw+88px,420px)] w-full max-w-[340px] touch-pan-y md:h-[480px] md:max-w-[400px] lg:max-w-[440px]">
      {[bot, mid].map((nft, i) => (
        <BackCard key={`${nft.id}-back-${i}`} nft={nft} stackIndex={i + 1} onSelect={onSelect} />
      ))}

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
          <FeaturedCard nft={top} onSelect={onSelect} />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
        {deck.map((nft, i) => (
          <span
            key={nft.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === cursor % deck.length ? 'w-5 bg-gold' : 'w-1.5 bg-ink/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function BackCard({
  nft,
  stackIndex,
  onSelect,
}: {
  nft: Nft
  stackIndex: number
  onSelect: (nft: Nft) => void
}) {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 origin-top md:hidden"
        style={{ zIndex: stackIndex }}
        animate={{
          x: STACK_OFFSETS[stackIndex].x,
          y: STACK_OFFSETS[stackIndex].y,
          rotate: STACK_OFFSETS[stackIndex].rotate,
          scale: STACK_OFFSETS[stackIndex].scale,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        <FeaturedCard nft={nft} onSelect={onSelect} />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 hidden origin-top md:block"
        style={{ zIndex: stackIndex }}
        animate={{
          x: DESKTOP_STACK_OFFSETS[stackIndex].x,
          y: DESKTOP_STACK_OFFSETS[stackIndex].y,
          rotate: DESKTOP_STACK_OFFSETS[stackIndex].rotate,
          scale: DESKTOP_STACK_OFFSETS[stackIndex].scale,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        <FeaturedCard nft={nft} onSelect={onSelect} />
      </motion.div>
    </>
  )
}

function FeaturedCard({ nft, onSelect }: { nft: Nft; onSelect: (nft: Nft) => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(nft)}
      className="group relative w-full cursor-grab text-left active:cursor-grabbing"
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
