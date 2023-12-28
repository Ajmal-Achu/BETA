// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import axios from 'axios'

let handler = async(m, { mufar, args, usedPrefix, command }) => {

let res = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/itzy.json`)).data 

let mystic = await res[Math.floor(res.length * Math.random())]

mufar.sendFile(m.chat, mystic, 'error.jpg', `_${command}_`, m)}

//mufar.sendButton(m.chat, `_${command}_`, author, mystic, [['🔄 𝚂𝙸𝙶𝚄𝙸𝙴𝙽𝚃𝙴 🔄', `/${command}`]], m)}

handler.help = ['itzy','kpopitzy']

handler.tags = ['internet']

handler.command = /^(itzy|kpopitzy)$/i

export default handler