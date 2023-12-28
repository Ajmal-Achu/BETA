// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fs from 'fs'

let handler = async (m, { mufar }) => {
	let d = new Date
            let date = d.toLocaleDateString('id', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
let a = await mufar.reply(global.owner[0] + '@s.whatsapp.net', `*🗓️ Database:* ${date}`, null)
mufar.sendFile(global.owner[0] + '@s.whatsapp.net', fs.readFileSync('./database.json'), 'database.json', '', 0, 0, { mimetype: 'application/json', quoted: a})
 }
 
handler.help = ['backup']
handler.tags = ['owner']
handler.command = /^(b|backup)$/i

export default handler