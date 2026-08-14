import { motion } from 'framer-motion'
import { collectionStats, traits } from '../data/lore'

const accents = [
  'from-sky/50 to-cream/40',
  'from-gold/30 to-cream/50',
  'from-blush/50 to-mist/40',
  'from-royal-soft/25 to-cream/45',
  'from-cream/60 to-gold/25',
  'from-mist/50 to-sky/40',
]

export function Traits() {
  return (
    <section id="traits" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-royal-soft">The Collection</p>
          <h2 className="font-display mt-3 text-4xl text-ink md:text-6xl">
            10,000 Luxora. No two meant to feel the same.
          </h2>
          <p className="mt-4 text-base font-light text-ink-soft md:text-lg">
            Built from a layered trait system around visual harmony — not random chaos. Each piece
            should look like it belongs in Luxora.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 md:mb-14 md:grid-cols-4 md:gap-4">
          {collectionStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="glass rounded-2xl px-4 py-5 text-center"
            >
              <p className="font-display text-3xl text-ink md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-ink-soft">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {traits.map((trait, i) => (
            <motion.article
              key={trait.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.55 }}
              className="group glass overflow-hidden rounded-[1.5rem] p-5 transition duration-300 hover:-translate-y-1 md:p-6"
            >
              <div
                className={`mb-5 h-24 rounded-2xl bg-gradient-to-br ${accents[i]} relative overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_30%_30%,white,transparent_55%)]" />
                <div className="absolute bottom-3 left-4 font-display text-5xl text-ink/15 transition group-hover:text-ink/25">
                  {trait.count}
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl text-ink">{trait.name}</h3>
                <span className="text-xs tracking-wider text-gold">{trait.count} variants</span>
              </div>
              <p className="mt-2 text-sm font-medium text-royal-soft">{trait.line}</p>
              <p className="mt-3 text-sm font-light leading-relaxed text-ink-soft">{trait.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
