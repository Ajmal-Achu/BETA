// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar, command }) => {
  let user = global.db.data.users[m.sender]
  let imgr = flaaa.getRandom()
  const caption = `
${htki} *H U T A N G  U S E R* ${htka}
${dmenub} 📛 *Name:* ${user.registered ? user.name : mufar.getName(m.sender)}
${dmenub} 💹 *Money:* ${user.money} 💲
${dmenuf}
`.trim()
  
  await mufar.sendFile(m.chat, imgr + command, "", caption, m)
}
handler.help = ['hutang']
handler.tags = ['rpg']
handler.command = /^(hutang)$/i

handler.register = false
export default handler