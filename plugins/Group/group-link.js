// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import { areJidsSameUser } from '@whiskeysockets/baileys'

let handler = async (m, { mufar, args }) => {
    let group = m.chat
    if (/^[0-9]{5,16}-?[0-9]+@g\.us$/.test(args[0])) group = args[0]
    if (!/^[0-9]{5,16}-?[0-9]+@g\.us$/.test(group)) throw 'Hanya bisa dibuka di grup'
    let groupMetadata = await mufar.groupMetadata(group)
    if (!groupMetadata) throw 'groupMetadata is undefined :\\'
    if (!('participants' in groupMetadata)) throw 'participants is not defined :('
    let me = groupMetadata.participants.find(user => areJidsSameUser(user.id, mufar.user.id))
    if (!me) throw 'Gw gk ada di grup itu 🗿'
    if (!me.admin) throw 'Gw bukan atmin bg 🗿'
    let urls = "https://chat.whatsapp.com/"
        let caption = `
${urls}${await mufar.groupInviteCode(group)}
`.trim()
    await mufar.sendMessage(m.chat, {text:caption},{quoted: m})
}
handler.help = ['linkgroup']
handler.tags = ['group']
handler.command = /^link(gro?up)?$/i

export default handler