// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, {
    mufar,
    usedPrefix,
    text,
    command,
    args
}) => {
    let pc = (Object.entries(await mufar.chats).map(([nama, isi]) => {
        return {
            nama,
            ...isi
        }
    })).filter(v => !v.nama.endsWith('g.us'))
    let list = pc.map((chat, index) => `*${index + 1}.* wa.me/${chat.id.split('@')[0]}`).join('\n')

    if (!args[0]) {
        m.reply(`📺 Private List:\n\n${list}`)
        return
    }

    let i = parseInt(args[0]) - 1
    if (!pc[i]) {
        return m.reply('Invalid index!')
    }

    let pp = await mufar.profilePictureUrl(pc[i].id, 'image')
    let str = `*Information about ${await mufar.getName(pc[i].id)}*\n\n`
    str += `*Name:* ${pc[i].name || 'Tidak diketahui'}\n`
    str += `*ID:* @${pc[i].id.replace('@s.whatsapp.net', '')}\n`
    str += `*Presences:* ${pc[i].presences || 'Tidak diketahui'}\n`

    await mufar.sendFile(m.chat, pp, 'profile.jpg', str, m, null, {
        mentions: [pc[i].id]
    })
}

handler.help = ['listpm']
handler.tags = ['owner']
handler.command = ['listpm']

export default handler