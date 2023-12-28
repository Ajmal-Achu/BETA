// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fs from 'fs'
import { randomBytes } from 'crypto'

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

let handler = async (m, { mufar, text, usedPrefix, command, isOwner, args }) => {
let chat = global.db.data.chats[m.chat]
let imgr = flaaa.getRandom()
let [_, code, expired] = text.match(linkRegex) || []
    if (!code) throw `*Example:* ${usedPrefix + command} ${sgc}`
    
    let res = await mufar.groupAcceptInvite(code)
    if (!res) throw res.toString()
    let name = await mufar.getName(res).catch(_ => null)
    let caption = `${dmenut} Sukses Join Di Grup
    ${dmenub} ${name || res}
    ${dmenub} *Jangan lupa baca rules ngap!*
    ${dmenuf}
    `
            await mufar.sendFile(m.chat, imgr + 'join', "", caption, m)
            
  if (chat.bcjoin) {
  let chats = Object.entries(mufar.chats).filter(([_, chat]) => chat.isChats).map(v => v[0])
  let cc = mufar.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m)
  let teks = text ? text : cc.text
  mufar.reply(m.chat, `Membagikan Link Grup Kamu ke ${chats.length} chat`, m)
  for (let id of chats) {
  await mufar.sendFile(id, imgr + 'New Group', "", "*「 New Group 」* \n\n" + text, m)
}
}

}
handler.command = /^join$/i
handler.rowner = true
export default handler
