import { useEffect, useState } from 'react'

const links = [
  { label: 'World', href: '#world' },
  { label: 'Collection', href: '#traits' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'The Light', href: '#light' },
  { label: 'Roadmap', href: '#roadmap' },
]

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
    bar: 'border-white/30 bg-[#1a1630]/45',
    logo: 'text-cream',
    link: 'text-cream/85 hover:text-cream',
    cta: 'bg-cream/95 text-ink hover:bg-gold-bright',
  },
  dark: {
    bar: 'border-white/60 bg-white/80',
    logo: 'text-ink',
    link: 'text-ink-soft hover:text-ink',
    cta: 'bg-ink text-cream hover:bg-royal',
  },
}

export function Nav() {
  const [theme, setTheme] = useState<NavTheme>('light')
  const styles = themeStyles[theme]

  useEffect(() => {
    const ids = Object.keys(sectionThemes)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible?.target.id) return
        setTheme(sectionThemes[visible.target.id] ?? 'dark')
      },
      { rootMargin: '-8% 0px -78% 0px', threshold: [0.2, 0.5] },
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 backdrop-blur-md transition-colors duration-300 md:px-6 ${styles.bar}`}
      >
        <a
          href="#top"
          className={`font-display text-2xl tracking-[0.08em] transition-colors duration-300 md:text-[1.65rem] ${styles.logo}`}
        >
          LUXORA
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 ${styles.link}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#gallery"
          className={`rounded-full px-4 py-2 text-xs font-medium tracking-wider transition-colors duration-300 md:text-sm ${styles.cta}`}
        >
          Enter Gallery
        </a>
      </div>
    </header>
  )
}
