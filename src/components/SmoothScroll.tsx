import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce || coarse) return

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
