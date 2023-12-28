// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar, usedPrefix, command, args: [event], text }) => {
    if (!event) return await mufar.sendButton(m.chat, `contoh:
${usedPrefix + command} welcome @user
${usedPrefix + command} bye @user
${usedPrefix + command} promote @user
${usedPrefix + command} demote @user`.trim(), wm, null, [['Welcome', '#simulate welcome'], ['Bye', '#simulate bye']])
    let mentions = text.replace(event, '').trimStart()
    let who = mentions ? mufar.parseMention(mentions) : []
    let part = who.length ? who : [m.sender]
    let act = false
    m.reply(`*${htjava} Simulating ${event}...*`)
    switch (event.toLowerCase()) {
        case 'add':
        case 'invite':
        case 'welcome':
            act = 'add'
            break
        case 'bye':
        case 'kick':
        case 'leave':
        case 'remove':
            act = 'remove'
            break
        case 'promote':
            act = 'promote'
            break
        case 'demote':
            act = 'demote'
            break
/*        case 'delete':
            deleted = m
            break
*/
        default:
            throw eror
    }
    if (act) return mufar.participantsUpdate({
        id: m.chat,
        participants: part,
        action: act
    })
//    return mufar.onDelete(m)
}
handler.help = ['simulate <event> [@mention]']
handler.tags = ['owner']
handler.rowner = true

handler.command = /^simulate$/i
export default handler