// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import { wallpaper } from '@bochilteam/scraper'
let handler = async (m, { mufar, text, usedPrefix, command }) => {
    if (!text) throw `Use example ${usedPrefix}${command} Minecraft`
    const res = await wallpaper(text)
    const img = res[Math.floor(Math.random() * res.length)]
    mufar.sendFile(m.chat, img, 'wallpaper.jpg', `Result from *${text}*`, m)
}
handler.help = ['wallpaper' + ' <query>']
handler.tags = ['downloader']

handler.command = /^(wallpaper)$/i

export default handler