// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

let handler = async (m, { mufar, command }) => {
	let url = `https://api.xyroinee.xyz/api/sfw/cosplay?apikey=${global.xyro}`
	mufar.sendFile(m.chat, url, '', '_Random Cosplay_', m)
}
handler.command = /^(cosplay)$/i
handler.tags = ['random']
handler.help = ['cosplay']
handler.limit = true
export default handler