import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import type { Nft } from '../data/nfts'

type Props = {
  nft: Nft | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function Lightbox({ nft, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    if (!nft) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [nft, onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      {nft && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-[#1a1630]/55 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[1.8rem] md:grid-cols-[1.15fr_0.85fr]"
          >
            <div className="bg-gradient-to-br from-cream/50 via-mist/30 to-sky/40 p-4 md:p-6">
              <img
                src={nft.src}
                alt={nft.title}
                className="mx-auto max-h-[62svh] w-full rounded-2xl object-contain md:max-h-[74svh]"
              />
            </div>
            <div className="flex flex-col justify-between gap-8 p-6 md:p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-royal-soft">{nft.vibe}</p>
                <h3 className="font-display mt-3 text-4xl leading-none text-ink md:text-5xl">
                  {nft.title}
                </h3>
                <p className="mt-3 text-sm tracking-wider text-ink-soft">{nft.edition}</p>
                <p className="mt-6 text-sm font-light leading-relaxed text-ink-soft md:text-base">
                  A Luxora from above the clouds — eye, vessel, and charms carrying their own light.
                  One glimpse of a world of 10,000.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onPrev}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink transition hover:bg-ink/5"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink transition hover:bg-ink/5"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-auto rounded-full bg-ink px-5 py-2 text-sm text-cream transition hover:bg-royal"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
