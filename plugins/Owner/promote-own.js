// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import { areJidsSameUser } from '@whiskeysockets/baileys'
let handler = async (m, { mufar, participants }) => {
    let users = m.mentionedJid.filter(u => !areJidsSameUser(u, mufar.user.id))
    let promoteUser = []
    for (let user of users)
        if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || { admin: true }).admin) {
            const res = await mufar.groupParticipantsUpdate(m.chat, [user], 'promote')
            await delay(1 * 1000)
        }
    m.reply('Succes')

}
handler.help = ['opromote'].map(v => v + ' @tag')
handler.tags = ['owner']
handler.command = /^(opromote)$/i
handler.owner = true
handler.group = true
handler.botAdmin = true
export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))