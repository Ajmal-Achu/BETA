// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar }) => {
	
	await mufar.fetchBlocklist().then(async data => {
		let txt = `*≡ List*\n\n*Total :* ${data.length}\n\n┌─⊷\n`
		for (let i of data) {
			txt += `▢ @${i.split("@")[0]}\n`
		}
		txt += "└───────────"
		return mufar.reply(m.chat, txt, m, { mentions: await mufar.parseMention(txt) })
	}).catch(err => {
		console.log(err);
		throw 'no numbers blocked'
	})
}

handler.help = ['blocklist']
handler.tags = ['main']
handler.command = ['blocklist', 'listblock'] 

export default handler