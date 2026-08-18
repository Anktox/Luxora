import { nfts, type Nft } from '../data/nfts'
import { useEffect, useRef } from 'react'

type Props = {
  onSelect: (nft: Nft) => void
}

const yMap = [0, -14, 12, -8, 16]

export function Gallery({ onSelect }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const bar = barRef.current
    if (!section || !track || !bar) return

    const supportsTimeline =
      typeof CSS !== 'undefined' &&
      'supports' in CSS &&
      (CSS.supports('animation-timeline: view()') ||
        CSS.supports('animation-timeline', 'view()'))

    if (supportsTimeline) return

    let start = 0
    let range = 1
    let ticking = false

    const measure = () => {
      start = section.offsetTop
      range = Math.max(1, section.offsetHeight - window.innerHeight)
    }

    const paint = () => {
      ticking = false
      const p = Math.min(1, Math.max(0, (window.scrollY - start) / range))
      track.style.transform = `translate3d(${6 - p * 78}%, 0, 0)`
      bar.style.transform = `scaleX(${p})`
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(paint)
    }

    measure()
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <section id="gallery" ref={sectionRef} className="gallery-pin relative h-[240vh]">
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
          <div className="glass-lite hidden min-w-[160px] rounded-2xl px-4 py-3 md:block">
            <p className="text-[11px] uppercase tracking-[0.24em] text-ink-soft">Preview</p>
            <p className="font-display mt-1 text-3xl text-ink">{nfts.length}</p>
            <p className="mt-0.5 text-[10px] tracking-wider text-ink-soft">of 10,000</p>
          </div>
        </div>

        <div className="relative flex flex-1 items-center overflow-hidden">
          <div ref={trackRef} className="gallery-track flex w-max items-center gap-5 px-8 md:gap-8 md:px-16">
            {nfts.map((nft, index) => (
              <GalleryPiece key={nft.id} nft={nft} index={index} onSelect={onSelect} />
            ))}
          </div>
        </div>

        <div className="mx-auto mb-8 w-full max-w-6xl px-5 md:px-10">
          <div className="h-[2px] overflow-hidden rounded-full bg-ink/10">
            <div ref={barRef} className="gallery-bar h-full origin-left bg-gold" />
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
  return (
    <button
      type="button"
      onClick={() => onSelect(nft)}
      className="gallery-card relative w-[64vw] max-w-[280px] shrink-0 text-left sm:w-[40vw] md:w-[260px]"
      style={{ transform: `translate3d(0, ${yMap[index % 5]}px, 0)` }}
    >
      <div className="glass-lite overflow-hidden rounded-[1.5rem] p-2.5">
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
