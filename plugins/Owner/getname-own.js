// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async(m, { mufar, command }) => {
  try {
  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
  else who = m.quoted.sender ? m.quoted.sender : m.sender
  let name = await mufar.getName(who)
  m.reply(name)
  } catch {
    try {
    let who = m.quoted ? m.quoted.sender : m.sender
    let name = await mufar.getName(who)
    m.reply(name)
  } catch {
    throw `sorry gk bisa coba yang lain⍨`
    }
  }
}
handler.help = ['getname <@tag/reply>']
handler.tags = ['owner']
handler.command = /^(get)?name?a?$/i
handler.owner = true
export default handler