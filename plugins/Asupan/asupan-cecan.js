// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'
import { pickRandom } from '../../lib/other-function.js'
let handler = async (m, { mufar, usedPrefix }) => {
let cecan = pickRandom(global.cecan)
    mufar.sendFile(m.chat, cecan, '', "Random Cecan", m, null, {
                mentions: mufar.parseMention("Random cecan")})
}
handler.help = handler.command = ['cecan']
handler.tags = ['asupan']

export default handler