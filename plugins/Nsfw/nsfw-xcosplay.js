// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

let handler = async (m, { mufar, usedPrefix, command }) => {


let res = await fetch('https://fantox-cosplay-api.onrender.co')

if (!res.ok) return m.react('❌')

let json = await res.json()

if (!json.url) return m.react('❌')

await mufar.sendFile(m.chat, json.url, 'xwaifu.png', '*RANDOM COSPLAY*', m)


}

handler.help = ['xcosplay']

handler.tags = ['nsfw']

handler.command = ['xcosplay']

handler.nsfw = true

export default handler