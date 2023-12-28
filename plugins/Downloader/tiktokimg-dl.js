// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

// Code by Xnuvers007 ft. Jikarinka
// https://github.com/Xnuvers007/
////////////////////////////////////

import axios from 'axios'
import cheerio from 'cheerio'

let handler = async(m, { mufar, text, args, command, usedPrefix}) => {
if (!text) throw 'Mana Kak Linknya?'

let url = `https://dlpanda.com/id?url=${text}&token=G7eRpMaa`

let response = await axios.get(url)
    const html = response.data;
    const $ = cheerio.load(html);

    let asd = []
    let imgSrc = []
    let creator = 'Jikarinka'

$('div.col-md-12 > img').each((index, element) => {
      imgSrc.push($(element).attr('src'));
    });

    asd.push({ creator, imgSrc })
  let fix = imgSrc.map((e,i) => {
  return {img: e, creator: creator[i] } 
  })

m.reply(wait)
for (let i of asd[0].imgSrc) {
     mufar.sendFile(m.chat, i, '', null, m)
     }
}

handler.help = ['tiktokimg / ttimg <url>']
handler.tags = ['downloader']
handler.command = /^(ttimg|tiktokimg)$/i
handler.register = true
handler.limit = true

export default handler