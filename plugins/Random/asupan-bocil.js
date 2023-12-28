// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

let handler = async(m, { mufar, usedPrefix, command }) => {

let res = await fetch('https://raw.githubusercontent.com/binjaicity/warga62/master/bocil.json')

let asup = await res.json()

let json = asup[Math.floor(Math.random() * asup.length)]

mufar.sendFile(m.chat, json.url, '', '_Nih Kak_', m)

}

handler.help = ['bocil']

handler.tags = ['random']


handler.command = /^(bocil)$/i

export default handler