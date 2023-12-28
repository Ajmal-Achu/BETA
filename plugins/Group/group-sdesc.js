// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { text }) => {
if(!text) throw 'Text?'
await mufar.groupUpdateDescription(m.chat, text)
return m.reply("Done.")
}

handler.help = ['setdesc'].map(v => v + ' <text>')
handler.tags = ['group']
handler.command = /^(setdesc|sdesc)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler