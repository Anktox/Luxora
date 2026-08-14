import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useEffect, useState } from 'react'

const links = [
  { label: 'World', href: '#world' },
  { label: 'Collection', href: '#traits' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'The Light', href: '#light' },
  { label: 'Roadmap', href: '#roadmap' },
]

/** light = cream text on dark backdrops · dark = ink text on light sections */
type NavTheme = 'light' | 'dark'

const sectionThemes: Record<string, NavTheme> = {
  top: 'light',
  world: 'dark',
  featured: 'dark',
  traits: 'dark',
  gallery: 'dark',
  light: 'dark',
  roadmap: 'dark',
  closer: 'light',
}

const themeStyles = {
  light: {
    bar: 'border-white/30 bg-[#1a1630]/35 shadow-[0_10px_40px_rgba(10,8,30,0.28)]',
    logo: 'text-cream',
    link: 'text-cream/85 hover:text-cream',
    cta: 'bg-cream/95 text-ink hover:bg-gold-bright',
  },
  dark: {
    bar: 'border-white/60 bg-white/72 shadow-[0_10px_40px_rgba(26,22,48,0.12)]',
    logo: 'text-ink',
    link: 'text-ink-soft hover:text-ink',
    cta: 'bg-ink text-cream hover:bg-royal',
  },
}

export function Nav() {
  const [theme, setTheme] = useState<NavTheme>('light')
  const { scrollY } = useScroll()
  const styles = themeStyles[theme]

  useMotionValueEvent(scrollY, 'change', () => {
    updateTheme()
  })

  useEffect(() => {
    updateTheme()

    const observer = new IntersectionObserver(
      () => updateTheme(),
      { rootMargin: '-72px 0px -78% 0px', threshold: [0, 0.15, 0.4, 0.7] },
    )

    Object.keys(sectionThemes).forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  function updateTheme() {
    const navLine = 88
    let best: { id: string; ratio: number } | null = null

    for (const [id] of Object.entries(sectionThemes)) {
      const el = document.getElementById(id)
      if (!el) continue

      const rect = el.getBoundingClientRect()
      const overlapTop = Math.max(rect.top, 0)
      const overlapBottom = Math.min(rect.bottom, navLine)
      const overlap = Math.max(0, overlapBottom - overlapTop)
      const ratio = overlap / navLine

      if (ratio > 0 && (!best || ratio > best.ratio)) {
        best = { id, ratio }
      }
    }

    if (best) {
      setTheme(sectionThemes[best.id] ?? 'dark')
    } else if (window.scrollY < 120) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 backdrop-blur-xl transition-[background-color,border-color,box-shadow,color] duration-500 md:px-6 ${styles.bar}`}
      >
        <a
          href="#top"
          className={`font-display text-2xl tracking-[0.08em] transition-colors duration-500 md:text-[1.65rem] ${styles.logo}`}
        >
          LUXORA
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors duration-500 ${styles.link}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#gallery"
          className={`rounded-full px-4 py-2 text-xs font-medium tracking-wider transition-colors duration-500 md:text-sm ${styles.cta}`}
        >
          Enter Gallery
        </a>
      </div>
    </motion.header>
  )
}
