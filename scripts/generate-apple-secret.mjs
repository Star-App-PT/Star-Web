import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(__dirname, '..')

const KEY_NAME = 'AuthKey_33TBARSA3M.p8'

const candidates = [
  process.env.APPLE_AUTH_KEY_PATH,
  path.join(repoRoot, KEY_NAME),
  path.join(os.homedir(), 'Downloads', KEY_NAME),
].filter(Boolean)

const keyPath = candidates.find((p) => {
  try {
    return fs.statSync(p).isFile()
  } catch {
    return false
  }
})

if (!keyPath) {
  console.error(
    `Could not find ${KEY_NAME}. Set APPLE_AUTH_KEY_PATH, or place the file at:\n` +
      `  ${path.join(repoRoot, KEY_NAME)}\n` +
      `  ${path.join(os.homedir(), 'Downloads', KEY_NAME)}`
  )
  process.exit(1)
}

const privateKey = fs.readFileSync(keyPath)

const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',
  issuer: '38MAGHVDV5',
  audience: 'https://appleid.apple.com',
  subject: 'co.star-app.app',
  keyid: '33TBARSA3M',
})

console.log('Apple Secret Key (JWT):')
console.log(token)
