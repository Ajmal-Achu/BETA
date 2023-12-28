// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

let handler = async (m, { mufar, command }) => {
    let {key } = await m.reply(wait)
	let res = await fetch(`https://api.zahwazein.xyz/randomasupan/discord18?apikey=zenzkey_96cfba379294`)
	let anu = await res.json()
    let video = await anu.result
	const bkp = mufar.sendFile(m.chat, anu.result, 'wikwik.mp4', '_Randomize_', m)
    
    
} 
handler.command = /^(bkp)$/i
handler.tags = ['random']
handler.help = ['bkp']
handler.premium = true
export default handler