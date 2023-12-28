// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

let handler = async(m, { mufar, text }) => {
  if (!text) throw `Nyari Apa?`
  let res = await fetch(`https://wibu-api.eu.org/api/lk21/search?title=${text}`)
  m.reply(wait)
  let json = await res.json()
  json = json.result.map((v) => `*Judul:* ${v.judul}\n*Link:* ${v.link}\n*Kategori:* ${v.kategori}\n*Download:* ${v.dl}\n`).join`\n\n°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\n\n`
  m.reply(json)
}
handler.help = ['lk21search']
handler.tags = ['internet']
handler.command = /^(lk21search)$/i
handler.limit = true

export default handler