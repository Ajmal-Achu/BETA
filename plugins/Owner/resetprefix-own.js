// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async(m, { mufar }) => {

  global.prefix = new RegExp('^[' + (opts['prefix'] || '!#/.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
    await m.reply(`Prefix berhasil direset`)
    // mufar.fakeReply(m.chat, 'Prefix berhasil direset', '0@s.whatsapp.net', 'Reset Prefix')
}
handler.help = ['resetprefix']
handler.tags = ['owner']
handler.command = /^(resetprefix)$/i
handler.rowner = true

export default handler