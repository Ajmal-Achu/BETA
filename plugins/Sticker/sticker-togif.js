// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import { webp2mp4 } from '../../lib/webp2mp4.js'

let handler = async (m, { mufar, usedPrefix, command }) => {
if (!m.quoted) throw `balas stiker dengan caption *${usedPrefix + command}*`
   let q = m.quoted ? m.quoted : m
   let mime = (q.msg || q).mimetype || ''
    if (!/webp/g.test(mime)) throw `balas stiker dengan caption *${usedPrefix + command}*`
    let media = await q.download?.()
    let out = Buffer.alloc(0)
    if (/webp/g.test(mime)) {
        out = await webp2mp4(media)
    }
    await mufar.sendMessage(m.chat, {
                video: { url: out },
                caption: '✅ sticker a gif',
                gifPlayback: true,
                gifAttribution: Math.floor(Math.random() * 2) + 1
            }, {
                quoted: m
            })
}
handler.help = ['togif (reply media)']
handler.tags = ['sticker']
handler.command = /^togifs?$/i

export default handler
