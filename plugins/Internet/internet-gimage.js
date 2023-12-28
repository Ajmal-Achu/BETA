// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import { googleImage } from '@bochilteam/scraper'
let handler = async (m, { mufar, text, usedPrefix, command }) => {
if (!text) throw `Use example ${usedPrefix + command} Minecraft`
const res = await googleImage(text)
let image = res.getRandom()
let link = image
mufar.sendFile(m.chat, link, 'gimage.jpg', `Result from : `+ text, m)
}
handler.help = ['gimage'].map(v => v + ' <query>')
handler.tags = ['internet']
handler.command = /^(gimage|googleimage)$/i
export default handler
