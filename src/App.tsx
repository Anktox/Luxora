import { useCallback, useState } from 'react'
import { AmbientBackground } from './components/AmbientBackground'
import { CloudField } from './components/CloudField'
import { CollectionGrid } from './components/CollectionGrid'
import { Featured } from './components/Featured'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { Lightbox } from './components/Lightbox'
import { LookCloser } from './components/LookCloser'
import { Nav } from './components/Nav'
import { Roadmap } from './components/Roadmap'
import { SmoothScroll } from './components/SmoothScroll'
import { TheLight } from './components/TheLight'
import { Traits } from './components/Traits'
import { WatchingEye } from './components/WatchingEye'
import { World } from './components/World'
import { nfts, type Nft } from './data/nfts'

export default function App() {
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
    <SmoothScroll>
      <AmbientBackground />
      <CloudField />
      <Nav />
      <main>
        <Hero />
        <World />
        <Featured onSelect={onSelect} />
        <Traits />
        <Gallery onSelect={onSelect} />
        <CollectionGrid onSelect={onSelect} />
        <TheLight />
        <Roadmap />
        <LookCloser />
      </main>
      <Footer />
      <WatchingEye />
      <Lightbox nft={active} onClose={onClose} onPrev={onPrev} onNext={onNext} />
    </SmoothScroll>
  )
}
