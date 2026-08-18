import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('assets')
const thumbs = path.join(root, 'thumbs')
await mkdir(thumbs, { recursive: true })

async function webp(input, output, opts) {
  await sharp(input).webp(opts).toFile(output)
  console.log('wrote', output)
}

await sharp(path.join(root, 'vitical.png'))
  .resize({ width: 720, withoutEnlargement: true })
  .webp({ quality: 72, effort: 6 })
  .toFile(path.join(root, 'vitical-720.webp'))
await sharp(path.join(root, 'vitical.png'))
  .resize({ width: 1080, withoutEnlargement: true })
  .webp({ quality: 74, effort: 6 })
  .toFile(path.join(root, 'vitical-1080.webp'))
console.log('wrote vitical webps')

await sharp(path.join(root, 'trait.png'))
  .resize({ width: 900, withoutEnlargement: true })
  .webp({ quality: 72, effort: 6 })
  .toFile(path.join(root, 'trait-900.webp'))
await sharp(path.join(root, 'trait.png'))
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 74, effort: 6 })
  .toFile(path.join(root, 'trait-1600.webp'))
console.log('wrote trait webps')

const nftIds = ['6', '8', '14', '20', '23', '37', '38', '39', '41', '43', '58']
for (const id of nftIds) {
  const src = path.join(root, `${id}.webp`)
  await sharp(src)
    .resize({ width: 640, withoutEnlargement: true })
    .webp({ quality: 72, effort: 6 })
    .toFile(path.join(thumbs, `${id}.webp`))
}

const files = await readdir(root)
console.log(
  'done',
  files.filter((f) => f.includes('vitical') || f.includes('trait')),
)
