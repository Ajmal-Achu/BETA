// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

let handler = async (m, { mufar, usedPrefix, command }) => {

m.reply(wait)
let res = await fetch('https://api.waifu.pics/nsfw/waifu')

if (!res.ok) return m.react('❌')

let json = await res.json()

if (!json.url) return m.react('❌')

await mufar.sendFile(m.chat, json.url, 'xwaifu.png', '*RANDOM WAIFU*', m)


}

handler.help = ['xwaifu']

handler.tags = ['nsfw']

handler.command = ['xwaifu']

handler.nsfw = true

export default handler