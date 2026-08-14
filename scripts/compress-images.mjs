import sharp from 'sharp'
import { readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

const dir = join(process.cwd(), 'public', 'assets')
const files = (await readdir(dir)).filter((f) => f.endsWith('.png'))

let inBytes = 0
let outBytes = 0

for (const file of files) {
  const src = join(dir, file)
  const out = join(dir, file.replace(/\.png$/, '.webp'))
  const meta = await sharp(src).metadata()
  const size = Math.min(meta.width, meta.height || meta.width)
  const img = await sharp(src)
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toBuffer()
  await sharp(img).toFile(out)
  const before = (await sharp(src).metadata()).size ?? 0
  inBytes += before
  outBytes += img.length
}

for (const file of files) {
  await rm(join(dir, file))
}

console.log(
  `Converted ${files.length} images: ${(inBytes / 1048576).toFixed(1)} MB -> ${(outBytes / 1048576).toFixed(1)} MB (${Math.round((1 - outBytes / inBytes) * 100)}% smaller)`
)