import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { heroPieces } from '../data/nfts'
import type { Nft } from '../data/nfts'

type Props = {
  onSelect: (nft: Nft) => void
}

export function Featured({ onSelect }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const rotateY = useTransform(scrollYProgress, [0.15, 0.85], [-12, 12])
  const depth = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [40, 0, -40])

  return (
    <section id="featured" ref={ref} className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl md:mb-16">
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

        <div
          className="relative"
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

function FeaturedCard({
  nft,
  index,
  onSelect,
}: {
  nft: Nft
  index: number
  onSelect: (nft: Nft) => void
}) {
  const z = index === 1 ? 60 : index === 0 ? 20 : 10
  const tilt = index === 0 ? -8 : index === 2 ? 8 : 0

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(nft)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ delay: index * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative text-left"
      style={{
        transform: `translateZ(${z}px) rotateY(${tilt}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="glass overflow-hidden rounded-[1.6rem] p-3 md:p-4">
        <div className="overflow-hidden rounded-[1.15rem] bg-gradient-to-br from-cream/40 to-sky/30">
          <img
            src={nft.src}
            alt={nft.title}
            loading="lazy"
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
