export type Nft = {
  id: number
  src: string
  title: string
  edition: string
  vibe: string
}

const titles = [
  'Celestial Drift',
  'Lotus Orbit',
  'Moonlit Reliquary',
  'Golden Halo',
  'Pearl Cascade',
  'Aurora Vessel',
  'Silk Horizon',
  'Starwoven Eye',
  'Cloud Sanctum',
  'Gilded Reverie',
  'Ember Lantern',
  'Tide Porcelain',
  'Nebula Charm',
  'Ivory Bloom',
  'Daybreak Twin',
  'Midnight Tassel',
  'Opaline Dream',
  'Sacred Orbit',
  'Whisper Castle',
  'Solar Filigree',
  'Lunar Pendant',
  'Jade Iris',
  'Velvet Orbit',
  'Crystal Dew',
  'Crown of Mist',
  'Amber Relic',
  'Blooming Void',
  'Silver Temple',
  'Echo of Gold',
  'Pastel Mirage',
  'Divine Sphere',
  'Ribbon Cosmos',
  'Fabled Nest',
  'Azure Reliquary',
  'Soft Thunder',
  'Pearl Kingdom',
  'Gilded Night',
  'Dawn Spectacle',
  'Ornate Watcher',
  'Hushed Galaxy',
  'Temple Cloud',
  'Radiant Relic',
  'Silk Constellation',
  'Ivory Oracle',
  'Floating Reliquary',
  'Cerulean Charm',
  'Golden Breath',
  'Mist Empress',
  'Sacred Bloom',
  'Orbiting Pearl',
  'Dream Cartography',
  'Velvet Relic',
  'Sunken Halo',
  'Porcelain Myth',
  'Lantern Eye',
  'Cosmic Heirloom',
  'Whisper Gold',
  'Starlit Vessel',
  'Eternal Drift',
  'Gilded Pulse',
  'Cloud Reliquary',
  'Aurora Pearl',
  'Luminous Pact',
]

const vibes = [
  'Celestial',
  'Ornate',
  'Dreamlike',
  'Sacred',
  'Luminous',
  'Mythic',
  'Ethereal',
  'Gilded',
]

export const nfts: Nft[] = Array.from({ length: 63 }, (_, i) => {
  const id = i + 1
  return {
    id,
    src: `/assets/${id}.webp`,
    title: titles[i] ?? `Luxora #${id}`,
    edition: `#${String(id).padStart(3, '0')} / 063`,
    vibe: vibes[i % vibes.length],
  }
})

export const featured = nfts[0]
export const heroPieces = [nfts[14], nfts[0], nfts[29]]
