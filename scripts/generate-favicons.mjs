import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { writeFile } from 'node:fs/promises'

const source = 'star-favicon-source-blue.png'

await sharp(source).resize(180, 180).png().toFile('public/apple-touch-icon.png')
await sharp(source).resize(32, 32).png().toFile('public/favicon-32x32.png')
await sharp(source).resize(16, 16).png().toFile('public/favicon-16x16.png')

const faviconIco = await pngToIco('public/favicon-32x32.png')
await writeFile('public/favicon.ico', faviconIco)

console.log('All favicons generated successfully')
