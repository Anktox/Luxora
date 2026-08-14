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

const revealedIds = [6, 8, 14, 20, 23, 37, 38, 39, 41, 43, 58]

export const nfts: Nft[] = revealedIds.map((id) => ({
  id,
  src: `/assets/${id}.webp`,
  title: titles[id - 1],
  edition: `#${String(id).padStart(3, '0')} / ${String(revealedIds.length).padStart(3, '0')}`,
  vibe: vibes[id % vibes.length],
}))

export const featured = nfts[0]
export const heroPieces = [nfts[4], nfts[0], nfts[10]]
