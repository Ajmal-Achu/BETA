// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fs from 'fs'
let handler = async (m, { mufar, text }) => {
    m.reply('Tunggu Sebentar, Sedang mengambil file sesi bot')
    let sesi = await fs.readFileSync('./MufarSession/creds.json')
    return await mufar.sendMessage(m.chat, { document: sesi, mimetype: 'application/json', fileName: 'creds.json' }, { quoted: m })
}
handler.help = ['getsessi']
handler.tags = ['owner']
handler.command = /^(g(et)?ses?si(on)?(data.json)?)$/i

handler.rowner = true

export default handler