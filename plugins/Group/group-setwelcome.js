// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar, text, isROwner, isOwner }) => {
  if (text) {
    if (isROwner) global.mufar.welcome = text
    else if (isOwner) mufar.welcome = text
    else global.db.data.chats.sWelcome = text
    m.reply('Welcome berhasil diatur\n@user (Mention)\n@subject (Judul Grup)')
  } else throw 'Teksnya mana?'
}
handler.help = ['setwelcome'].map(v => v + ' <text>')
handler.tags = ['group']
handler.command = /^setwelcome$/i
handler.group = true
handler.admin = true

export default handler