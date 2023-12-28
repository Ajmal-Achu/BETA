// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

let handler = async (m, { mufar, usedPrefix, command }) => {

await m.reply(wait)

let res = await fetch('https://api.waifu.pics/nsfw/trap')

if (!res.ok) return m.react('❌')

let json = await res.json()

if (!json.url) return m.react('❌')

await mufar.sendFile(m.chat, json.url, 'trap.png', '*RANDOM TRAP*', m)


}

handler.help = ['trap']

handler.tags = ['nsfw']

handler.command = ['trap']

handler.nsfw = true

export default handler