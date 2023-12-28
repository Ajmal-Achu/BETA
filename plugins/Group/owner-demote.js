// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import { areJidsSameUser } from '@whiskeysockets/baileys'
let handler = async (m, { mufar, participants }) => {
let users = m.mentionedJid.filter(u => !areJidsSameUser(u, mufar.user.id))
let user = m.mentionedJid && m.mentionedJid[0]
await mufar.groupParticipantsUpdate(m.chat, [user], 'demote')
m.reply('Succes')
}
handler.help = ['odemote'].map(v => v + ' @tag')
handler.tags = ['group']
handler.command = /^(odemote)$/i
handler.owner = true
handler.group = true
handler.botAdmin = true
export default handler