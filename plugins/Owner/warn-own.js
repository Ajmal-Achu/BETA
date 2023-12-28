// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar, args, usedPrefix }) => {
    if (args.length > 0) {
        let mention = args[0].replace(/[@.+-]/g, '').replace(' ', '')
        let ban = m.mentionedJid[0] || m.quoted.sender || mufar.parseMention(args[0]) || (args[0].replace(/[@.+-]/g, '').replace(' ', '') + '@s.whatsapp.net') || ''
        let warn = global.db.data.users[ban].warn
        if (warn < 3) {
            global.db.data.users[ban].warn += 1
            m.reply(`*berhasil Warn!*`)
            mufar.reply(ban, '*Kamu di warn oleh moderator, dan sekarang kamu punya ' + (warn + 1) + '.Ingat Jika kamu mendapat warn 4 kali kamu akan otomatis ke banned*', null)
        } else if (warn == 3) {
            global.db.data.users[ban].banned = true
            global.db.data.users[ban].warn = 0
            m.reply('*Dia sudah kebanned, karena mendapatkan 4 warn*')
            mufar.reply(ban, '*Kamu ke banned karena telah mendapatkan 4 kali warn*', null)
        }
    } else mufar.reply(m.chat, '*Siapa yang mau di Warn?*', m)
}
handler.help = ['warn @tag']
handler.tags = ['owner']
handler.command = /^warn$/i
handler.mods = true

export default handler