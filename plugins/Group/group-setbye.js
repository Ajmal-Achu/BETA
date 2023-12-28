// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar, text, isROwner, isOwner }) => {
  if (text) {
    if (isROwner) global.mufar.bye = text
    else if (isOwner) mufar.bye = text
    else global.db.data.chats.sBye = text
    m.reply('Bye berhasil diatur\n@user (Mention)')
  } else throw 'Teksnya mana?'
}
handler.help = ['setbye'].map(v => v + ' <text>')
handler.tags = ['group']
handler.command = /^setbye$/i
handler.group = true
handler.admin = true

export default handler