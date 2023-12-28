// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar }) => {
  let res = await mufar.groupRevokeInvite(m.chat)
  let gruf = m.chat
  mufar.reply(m.sender, 'https://chat.whatsapp.com/' + await mufar.groupInviteCode(gruf), m)
}
handler.help = ['revoke']
handler.tags = ['group']
handler.command = /^re(voke|new)(invite|link)?$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler