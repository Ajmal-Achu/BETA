// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'
let handler = async(m, { mufar, text }) => {
  let res = await (await fetch('https://katanime.vercel.app/api/getrandom?limit=1'))
  if (!res.ok) throw await res.text()
  let json = await res.json()
  if(!json.result[0]) throw json
  let { indo, character, anime } = json.result[0]
  mufar.reply(m.chat, `${indo}\n\nBy: ~ _${character}_ ~\nAnime:\n${anime}`, m)
}
handler.help = ['quotesanime']
handler.tags = ['quotes']
handler.command = /^(quotesanime|kataanime)$/i
export default handler 
