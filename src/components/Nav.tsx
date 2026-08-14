import { motion } from 'framer-motion'

const links = [
  { label: 'World', href: '#world' },
  { label: 'Traits', href: '#traits' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'The Light', href: '#light' },
  { label: 'Roadmap', href: '#roadmap' },
]

export function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/25 bg-white/12 px-4 py-3 shadow-[0_10px_40px_rgba(10,8,30,0.18)] backdrop-blur-xl md:px-6">
        <a href="#top" className="font-display text-2xl tracking-[0.08em] text-cream md:text-[1.65rem]">
          LUXORA
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-cream/80 transition hover:text-cream"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#gallery"
          className="rounded-full bg-cream/95 px-4 py-2 text-xs font-medium tracking-wider text-ink transition hover:bg-gold-bright md:text-sm"
        >
          Enter Gallery
        </a>
      </div>
    </motion.header>
  )
}
