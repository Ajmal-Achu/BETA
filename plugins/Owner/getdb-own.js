// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fs from 'fs'
let handler = async (m, { mufar, text }) => {
    m.reply('Tunggu Sebentar, Sedang mengambil file Database')
    let sesi = await fs.readFileSync('./database.json')
    return await mufar.sendMessage(m.chat, { document: sesi, mimetype: 'application/json', fileName: 'database.json' }, { quoted: m })
}
handler.help = ['getdb']
handler.tags = ['owner']
handler.command = /^(getdb)$/i

handler.rowner = true

export default handler