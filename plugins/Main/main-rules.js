// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

let handler = async (m, { mufar }) => {
let res = await fetch('https://raw.githubusercontent.com/Chandra-XD/cn-grabbed-result/main/text/bot/rules.txt')
let txt = await res.text()
await mufar.reply(m.chat, `*Hai kak ${mufar.getName(m.sender)}, dibaca ya rulesnya*
${txt}
*────────────────────────*
`.trim(), m)
}
handler.help = ['rules']
handler.tags = ['main']
handler.command = /^(rules|peraturan)$/i
export default handler