// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar }) => {
    let txt = ''
    for (let [jid, chat] of Object.entries(mufar.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)) txt += `${await mufar.getName(jid)}\n•> ${jid} [${chat?.metadata?.read_only ? 'Left' : 'Joined'}]\n\n`
    await m.reply(`*List Groups :*

${txt}
`.trim())
}
handler.help = ['listgc']
handler.tags = ['info']
handler.command = /^listgc|grouplist$/i
export default handler
