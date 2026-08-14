import { motion } from 'framer-motion'
import { nfts, type Nft } from '../data/nfts'

type Props = {
  onSelect: (nft: Nft) => void
}

export function CollectionGrid({ onSelect }: Props) {
  return (
    <section id="collection" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-royal-soft">
            Vault Preview
          </p>
          <h2 className="font-display mt-3 text-4xl text-ink md:text-6xl">What the clouds have shown so far</h2>
          <p className="mt-4 text-base font-light text-ink-soft md:text-lg">
            A curated glimpse of the visual language — before the full 10,000 awaken.
          </p>
        </div>

        <div className="columns-2 gap-4 sm:columns-3 md:columns-4 md:gap-5">
          {nfts.map((nft, index) => (
            <motion.button
              key={nft.id}
              type="button"
              onClick={() => onSelect(nft)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (index % 8) * 0.04, duration: 0.55 }}
              className="group mb-4 break-inside-avoid text-left md:mb-5"
            >
              <div className="glass overflow-hidden rounded-2xl p-2 transition duration-300 hover:-translate-y-1">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={nft.src}
                    alt={nft.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full object-cover transition duration-500 group-hover:scale-105"
                    style={{ aspectRatio: index % 3 === 0 ? '3/4' : index % 3 === 1 ? '1/1' : '4/5' }}
                  />
                </div>
                <div className="px-2 py-3">
                  <p className="font-display text-lg leading-none text-ink">{nft.title}</p>
                  <p className="mt-1 text-[11px] tracking-wider text-ink-soft">{nft.edition}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
