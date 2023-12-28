// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler  = async (m, { mufar, args, text }) => {
if (!text) throw `*[Info] Masukkan teks*`
try {
let text = args.join` `
if(!args || !args[0]) {
} else {
mufar.groupUpdateSubject(m.chat, text)}
} catch (e) {
throw '*[Info] Error*'
}}
handler.help = ['setname'].map(v => v + ' <text>')
handler.tags = ['group']
handler.command = /^(setname)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler