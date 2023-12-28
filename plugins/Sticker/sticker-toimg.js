// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import { webp2png } from '../../lib/webp2mp4.js'

let handler = async (m, { mufar, usedPrefix, command }) => {
    const notStickerMessage = `Reply sticker with command *${usedPrefix + command}*`
    if (!m.quoted) throw notStickerMessage
    const q = m.quoted || m
    let mime = q.mediaType || ''
    if (!/sticker/.test(mime)) throw notStickerMessage
    let media = await q.download()
    let out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)
    await mufar.sendFile(m.chat, out, 'out.png', '*DONE (≧ω≦)ゞ*\n', m)
}
handler.help = ['toimg (reply)']
handler.tags = ['sticker']
handler.command = /^t(oim(age|g)|im(age|g))$/i

export default handler
