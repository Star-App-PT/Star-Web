import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import os from 'os'

const privateKey = fs.readFileSync(
  path.join(os.homedir(), 'Downloads', 'AuthKey_33TBARSA3M.p8')
)

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
