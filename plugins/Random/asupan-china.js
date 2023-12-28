// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

let handler = async (m, { mufar, command }) => {
	let url = `https://api.xyroinee.xyz/api/asupan/image/china?apikey=${global.xyro}`
	mufar.sendFile(m.chat, url, 'anu.jpg', '_Nih Kak_', m)
}
handler.command = /^(china)$/i
handler.tags = ['random']
handler.help = ['china']
handler.premium = false
handler.limit = true

export default handler