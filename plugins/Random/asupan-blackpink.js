// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

let bpink = []
fetch('https://raw.githubusercontent.com/arivpn/dbase/master/kpop/blekping.txt')
    .then(res => res.text())
    .then(txt => bpink = txt.split('\n'))
let handler = async (m, { mufar }) => {
    let img = bpink[Math.floor(Math.random() * bpink.length)]
    if (!img) throw img
    await mufar.sendFile(m.chat, img, '', '_Nih Kak_', m, 0, { thumbnail: await (await fetch(img)).buffer() })
}
handler.help = ['blackpink']
handler.tags = ['random']
handler.limit = true
handler.command = /^(bpink|bp|blackpink)$/i

export default handler
