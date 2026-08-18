import { motion, useScroll, useTransform } from 'framer-motion'
import { nfts, type Nft } from '../data/nfts'
import { useRef } from 'react'

type Props = {
  onSelect: (nft: Nft) => void
}

const depthMap = [0, 8, -6, 5, -4]
const yMap = [0, -18, 14, -10, 20]
const rotMap = [-3, 2, -1.5, 3, -2.5]

export function Gallery({ onSelect }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['6%', '-72%'])
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="gallery" ref={sectionRef} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="relative z-10 mx-auto flex w-full max-w-6xl items-end justify-between gap-6 px-5 pb-4 pt-28 md:px-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-royal-soft">
              The Hall
            </p>
            <h2 className="font-display mt-2 text-4xl text-ink md:text-6xl">Walk the cloud corridor</h2>
            <p className="mt-3 max-w-md text-sm font-light text-ink-soft md:text-base">
              A drift through early Luxora sightings. Tap any being to look closer.
            </p>
          </div>
          <div className="glass hidden min-w-[160px] rounded-2xl px-4 py-3 md:block">
            <p className="text-[11px] uppercase tracking-[0.24em] text-ink-soft">Preview</p>
            <p className="font-display mt-1 text-3xl text-ink">{nfts.length}</p>
            <p className="mt-0.5 text-[10px] tracking-wider text-ink-soft">of 10,000</p>
          </div>
        </div>

        <div className="relative flex flex-1 items-center overflow-hidden">
          <motion.div
            style={{ x }}
            className="flex w-max items-center gap-5 px-8 will-change-transform md:gap-8 md:px-16"
          >
            {nfts.map((nft, index) => (
              <GalleryPiece key={nft.id} nft={nft} index={index} onSelect={onSelect} />
            ))}
          </motion.div>
        </div>

        <div className="mx-auto mb-8 w-full max-w-6xl px-5 md:px-10">
          <div className="h-[2px] overflow-hidden rounded-full bg-ink/10">
            <motion.div style={{ width: progressWidth }} className="h-full bg-gold" />
          </div>
        </div>
      </div>
    </section>
  )
}

function GalleryPiece({
  nft,
  index,
  onSelect,
}: {
  nft: Nft
  index: number
  onSelect: (nft: Nft) => void
}) {
  const pattern = index % 5

  return (
    <button
      type="button"
      onClick={() => onSelect(nft)}
      className="group relative w-[68vw] max-w-[300px] shrink-0 text-left sm:w-[42vw] md:w-[280px]"
      style={{
        transform: `translateY(${yMap[pattern]}px) rotate(${rotMap[pattern]}deg) translateZ(${depthMap[pattern]}px)`,
      }}
    >
      <div className="glass-lite overflow-hidden rounded-[1.5rem] p-2.5 shadow-[0_12px_32px_rgba(26,22,48,0.08)]">
        <div className="overflow-hidden rounded-[1.1rem] bg-cream/40">
          <img
            src={nft.thumb}
            alt={nft.title}
            width={640}
            height={800}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
        <div className="flex items-end justify-between gap-3 px-2 pb-1 pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-royal-soft">{nft.vibe}</p>
            <h3 className="font-display mt-1 text-xl leading-none text-ink md:text-2xl">
              {nft.title}
            </h3>
          </div>
          <span className="text-[11px] tracking-wider text-ink-soft">{nft.edition}</span>
        </div>
      </div>
    </button>
  )
}
