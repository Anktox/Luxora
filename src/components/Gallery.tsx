import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useMemo, useRef } from 'react'
import { nfts, type Nft } from '../data/nfts'

type Props = {
  onSelect: (nft: Nft) => void
}

export function Gallery({ onSelect }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-78%'])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [6, 0, -4])
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const pieces = useMemo(() => nfts, [])

  return (
    <section id="gallery" ref={sectionRef} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="relative z-10 mx-auto flex w-full max-w-6xl items-end justify-between gap-6 px-5 pb-4 pt-28 md:px-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-royal-soft">
              The Hall
            </p>
            <h2 className="font-display mt-2 text-4xl text-ink md:text-6xl">Walk the cloud corridor</h2>
            <p className="mt-3 max-w-md text-sm font-light text-ink-soft md:text-base">
              A 3D drift through early Luxora sightings. Click any being to look closer.
            </p>
          </div>
          <div className="glass hidden min-w-[160px] rounded-2xl px-4 py-3 md:block">
            <p className="text-[11px] uppercase tracking-[0.24em] text-ink-soft">Preview</p>
            <p className="font-display mt-1 text-3xl text-ink">63</p>
            <p className="mt-0.5 text-[10px] tracking-wider text-ink-soft">of 10,000</p>
          </div>
        </div>

        <div
          className="relative flex flex-1 items-center"
          style={{ perspective: '1600px', perspectiveOrigin: '50% 50%' }}
        >
          <motion.div
            style={{ x, rotateX, transformStyle: 'preserve-3d' }}
            className="flex w-max items-center gap-6 px-8 will-change-transform md:gap-10 md:px-16"
          >
            {pieces.map((nft, index) => (
              <GalleryPiece
                key={nft.id}
                nft={nft}
                index={index}
                progress={scrollYProgress}
                onSelect={onSelect}
              />
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
  progress,
  onSelect,
}: {
  nft: Nft
  index: number
  progress: MotionValue<number>
  onSelect: (nft: Nft) => void
}) {
  const pattern = index % 5
  const depthMap = [0, 70, -50, 40, -30]
  const yMap = [0, -36, 28, -18, 40]
  const rotMap = [-6, 4, -3, 7, -5]

  const depth = depthMap[pattern]
  const floatY = yMap[pattern]
  const baseRot = rotMap[pattern]

  const local = useTransform(progress, (v) => {
    const center = index / 63
    return (v - center) * 18
  })
  const rotateY = useTransform(local, (v) => baseRot + v)

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(nft)}
      style={{
        y: floatY,
        rotateY,
        z: depth,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.04, z: depth + 40 }}
      className="group relative w-[68vw] max-w-[340px] shrink-0 text-left sm:w-[46vw] md:w-[320px]"
    >
      <div className="glass-strong overflow-hidden rounded-[1.75rem] p-3 transition duration-500 group-hover:shadow-[0_30px_80px_rgba(47,74,155,0.18)]">
        <div className="relative overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-cream/50 via-mist/40 to-sky/40">
          <img
            src={nft.src}
            alt={nft.title}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>
        <div className="flex items-end justify-between gap-3 px-2 pb-1 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-royal-soft">{nft.vibe}</p>
            <h3 className="font-display mt-1 text-xl leading-none text-ink md:text-2xl">
              {nft.title}
            </h3>
          </div>
          <span className="text-[11px] tracking-wider text-ink-soft">{nft.edition}</span>
        </div>
      </div>
    </motion.button>
  )
}
