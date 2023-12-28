// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

let handler = async (m, { mufar, text }) => {

try {

let res = await fetch('https://api.thecatapi.com/v1/images/search')

let img = await res.json()

let caption = `

_©The Lasdan - Bot_

`.trim()

mufar.sendFile(m.chat, img[0].url, 'cat.jpg', caption, m)

} catch (e) {

console.log(e)

throw '*Error!*'

}}

handler.help = ['cat']

handler.tags = ['random']

handler.command = /^cat$/i

handler.fail = null

export default handler