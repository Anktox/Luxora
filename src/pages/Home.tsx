import { lazy, Suspense, useCallback, useState } from 'react'
import { AmbientBackground } from '../components/AmbientBackground'
import { Footer } from '../components/Footer'
import { Gallery } from '../components/Gallery'
import { Hero } from '../components/Hero'
import { LookCloser } from '../components/LookCloser'
import { Nav } from '../components/Nav'
import { Roadmap } from '../components/Roadmap'
import { TheLight } from '../components/TheLight'
import { Traits } from '../components/Traits'
import { World } from '../components/World'
import { nfts, type Nft } from '../data/nfts'

const Featured = lazy(() =>
  import('../components/Featured').then((m) => ({ default: m.Featured })),
)
const Lightbox = lazy(() =>
  import('../components/Lightbox').then((m) => ({ default: m.Lightbox })),
)
const WatchingEye = lazy(() =>
  import('../components/WatchingEye').then((m) => ({ default: m.WatchingEye })),
)

export default function Home() {
  const [active, setActive] = useState<Nft | null>(null)

  const onSelect = useCallback((nft: Nft) => setActive(nft), [])
  const onClose = useCallback(() => setActive(null), [])

  const onPrev = useCallback(() => {
    setActive((current) => {
      if (!current) return current
      const index = nfts.findIndex((item) => item.id === current.id)
      return nfts[(index - 1 + nfts.length) % nfts.length]
    })
  }, [])

  const onNext = useCallback(() => {
    setActive((current) => {
      if (!current) return current
      const index = nfts.findIndex((item) => item.id === current.id)
      return nfts[(index + 1) % nfts.length]
    })
  }, [])

  return (
    <>
      <AmbientBackground />
      <Nav />
      <main>
        <Hero />
        <World />
        <Suspense fallback={<div className="h-[70vh]" />}>
          <Featured onSelect={onSelect} />
        </Suspense>
        <Traits />
        <Gallery onSelect={onSelect} />
        <TheLight />
        <Roadmap />
        <LookCloser />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <WatchingEye />
        <Lightbox nft={active} onClose={onClose} onPrev={onPrev} onNext={onNext} />
      </Suspense>
    </>
  )
}
