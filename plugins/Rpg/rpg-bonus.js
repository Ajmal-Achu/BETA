// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar }) => {
  if (new Date - global.db.data.users[m.sender].lastclaim > 86400000) {
    mufar.reply(m.chat, 'Nih Gw Kasih Modal Buat beli limit\n💰50.000 Rupiah', m)  
    global.db.data.users[m.sender].money += 50000
    global.db.data.users[m.sender].lastclaim = new Date * 1
  } else mufar.reply(m.chat, '📮Bagi link bokep 100.000:v', m)
}
handler.help = ['bonus', 'hadiah']
handler.tags = ['rpg']
handler.command = /^(bonus|hadiah)$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0

export default handler 

