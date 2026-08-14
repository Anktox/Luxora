import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useRef, useState } from 'react'
import { heroPieces } from '../data/nfts'
import type { Nft } from '../data/nfts'

type Props = {
  onSelect: (nft: Nft) => void
}

const PEEK_OFFSETS = [
  { rotate: -3.5, y: -10, x: -12, scale: 0.94 },
  { rotate: 4, y: -20, x: 14, scale: 0.88 },
]

const SWIPE_THRESHOLD = 60

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

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.22em] text-ink-soft">
          Swipe or drag to reveal the next · Tap to open
        </p>
      </div>
    </section>
  )
}

function FeaturedStack({ deck, onSelect }: { deck: Nft[]; onSelect: (nft: Nft) => void }) {
  const [cursor, setCursor] = useState(0)
  const [exitX, setExitX] = useState(0)
  const dragged = useRef(false)

  const top = deck[cursor % deck.length]
  const mid = deck[(cursor + 1) % deck.length]
  const bot = deck[(cursor + 2) % deck.length]
  const peekCards = [bot, mid]

  const dismiss = (direction: 1 | -1) => {
    dragged.current = true
    setExitX(direction * 360)
    setCursor((c) => (c + 1) % deck.length)
  }

  const onDragStart = () => {
    dragged.current = false
  }

  const onDrag = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 8) dragged.current = true
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) dismiss(-1)
    else if (info.offset.x < -SWIPE_THRESHOLD) dismiss(1)

    window.setTimeout(() => {
      dragged.current = false
    }, 120)
  }

  const onTap = () => {
    if (!dragged.current) onSelect(top)
  }

  return (
    <div className="featured-stack-wrap mx-auto flex flex-col items-center">
      <div className="featured-stack relative w-full touch-pan-y">
        {peekCards.map((nft, i) => {
          const stackIndex = i + 1
          const offset = PEEK_OFFSETS[i]
          return (
            <motion.div
              key={`peek-${nft.id}-${stackIndex}`}
              className="pointer-events-none absolute inset-x-0 top-6 origin-top"
              style={{ zIndex: stackIndex }}
              animate={{
                x: offset.x,
                y: offset.y,
                rotate: offset.rotate,
                scale: offset.scale,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              <PeekCard nft={nft} />
            </motion.div>
          )
        })}

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`${top.id}-${cursor}`}
            className="absolute inset-x-0 top-6 origin-top cursor-grab active:cursor-grabbing"
            style={{ zIndex: 10, touchAction: 'pan-y' }}
            initial={{ x: exitX, opacity: 0, rotate: 0, scale: 0.98 }}
            animate={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
            exit={{ x: exitX, opacity: 0, rotate: exitX * 0.05, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.75}
            dragMomentum={false}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onTap={onTap}
            whileDrag={{ scale: 1.02 }}
          >
            <FeaturedCard nft={top} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-2">
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

function PeekCard({ nft }: { nft: Nft }) {
  return (
    <div
      aria-hidden
      className="featured-peek glass overflow-hidden rounded-[clamp(1rem,3vw,1.6rem)] p-[clamp(0.5rem,2vw,0.85rem)] shadow-[0_16px_40px_rgba(26,22,48,0.1)]"
    >
      <div className="overflow-hidden rounded-[clamp(0.75rem,2vw,1.15rem)] bg-gradient-to-br from-cream/40 to-sky/30">
        <img
          src={nft.src}
          alt=""
          loading="lazy"
          draggable={false}
          className="aspect-square w-full object-cover"
        />
      </div>
    </div>
  )
}

function FeaturedCard({ nft }: { nft: Nft }) {
  return (
    <div className="group relative w-full select-none">
      <div className="glass overflow-hidden rounded-[clamp(1rem,3vw,1.6rem)] p-[clamp(0.5rem,2vw,0.85rem)] shadow-[0_20px_50px_rgba(26,22,48,0.12)] md:p-4">
        <div className="overflow-hidden rounded-[clamp(0.75rem,2vw,1.15rem)] bg-gradient-to-br from-cream/40 to-sky/30">
          <img
            src={nft.src}
            alt={nft.title}
            loading="lazy"
            draggable={false}
            className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex items-end justify-between gap-3 px-1 pb-0.5 pt-[clamp(0.65rem,2vw,1rem)] md:px-2 md:pt-4">
          <div className="min-w-0">
            <p className="text-[clamp(9px,2.2vw,11px)] uppercase tracking-[0.22em] text-royal-soft">
              {nft.vibe}
            </p>
            <h3 className="font-display mt-0.5 truncate text-[clamp(1.25rem,4.5vw,1.5rem)] leading-tight text-ink">
              {nft.title}
            </h3>
          </div>
          <span className="shrink-0 text-[clamp(10px,2.2vw,12px)] tracking-wider text-ink-soft">
            {nft.edition}
          </span>
        </div>
      </div>
    </div>
  )
}
