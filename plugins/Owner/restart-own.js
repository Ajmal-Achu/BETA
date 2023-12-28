// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import { spawn } from 'child_process'
let handler = async (m, { mufar, isROwner, text }) => {
    if (!process.send) throw 'Dont: node main.js\nDo: node index.js'
    if (global.mufar.user.jid == mufar.user.jid) {
    await m.reply('```R E S T A R T . . .```')
    process.send('reset')
  } else throw '_eeeeeiiittsssss..._'
}

handler.help = ['restart']
handler.tags = ['owner']
handler.command = /^(res(tart)?)$/i

handler.rowner = true

export default handler