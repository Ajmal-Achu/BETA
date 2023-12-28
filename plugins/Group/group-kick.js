// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fs from 'fs'
let handler = async (m, { mufar, args }) => {
 let ownerGroup = m.chat.split`-`[0] + '@s.whatsapp.net'
  let aki = m.quoted ? [m.quoted.sender] : m.mentionedJid
  let users = aki.filter(u => !(u == ownerGroup || u.includes(mufar.user.jid)))
  let wayy = '*Kick*'
  for (let i of users) {
  wayy += ` @${i.split('@')[0]}`
  }
  mufar.reply(m.chat, wayy, m, { contextInfo: { mentionedJid: users }})
  for (let user of users) if (user.endsWith('@s.whatsapp.net')) await mufar.groupParticipantsUpdate(m.chat, [user], "remove")
}
handler.help = ['kick'].map(v => v + ' @user')
handler.tags = ['group']
handler.command = /^(kick)$/i
handler.group = true
handler.botAdmin = true
handler.admin = true 

export default handler