// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import axios from 'axios'

let handler = async (m, { mufar, text }) => {
    if (!text) throw `Link?`
    if (!text.includes("episode")) throw `Invalid Url...`
    let res = (await axios.get(API('can', '/api/anime/otakudesu/dl', { link: text } ))).data;
    let x = res.result
    try {
    await mufar.reply(m.chat, `*Title :* ${x.title}\n\n*Download Quality 360p :* ${x.low}\n*Download Quality 480p :* ${x.medium}\n*Download Quality 720p :* ${x.high}`, m)
    } catch (e) {
		console.log(e)
		m.reply(`Error :(`)
	}
	// By Chandra XD
	// Follow bang
	// TikTok : @pnggilajacn
	// Github : https://github.com/Chandra-XD
	}
handler.help = ['otakudl'].map(v => v + ' <id>')
handler.tags = ['downloader']
handler.command = /^(otakudl|otakudesudl)$/i
export default handler