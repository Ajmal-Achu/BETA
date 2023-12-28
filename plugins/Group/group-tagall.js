// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar, text, participants }) => {
	let users = participants.map(u => u.id).filter(v => v !== mufar.user.jid)
    m.reply(`${text ? `${text}\n\n` : ''}` + users.map(v => '@' + v.replace(/@.+/, '')).join`\n`, null, { mentions: users })
}

handler.help = ['tagall']
handler.tags = ['group']
handler.command = /^(tagall)$/i
handler.admin = handler.group = true

export default handler