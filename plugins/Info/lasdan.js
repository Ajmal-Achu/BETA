// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch'

import fs from 'fs'

let handler = async (m, { mufar, generateWAMessageFromContent, }) => {

let { anon, anticall, antispam, antitroli, backup, jadibot, groupOnly, nsfw, statusupdate, autogetmsg, antivirus, publicjoin } = global.db.data.settings[mufar.user.jid]

const chats = Object.keys(await mufar.chats)

const groups = Object.keys(await mufar.groupFetchAllParticipating())

const block = await mufar.fetchBlocklist()

const fgclink = {

"key": {

"fromMe": false,

"participant": "0@s.whatsapp.net",

"remoteJid": "0@s.whatsapp.net"

},

"message": {

"groupInviteMessage": {

"groupJid": "6282127487538-1625305606@g.us",

"inviteCode": "null",

"groupName": "Halo", 

"caption": wm, 

'jpegThumbnail': fs.readFileSync('./media/ok.jpg')

}

}

}

let tag = `@${m.sender.replace(/@.+/, '')}`

let mentionedJid = [m.sender]

let _uptime = process.uptime() * 1000

let uptime = clockString(_uptime)

let sts = `┌────〔 Status 〕───⬣

│✧ Aktif selama ${uptime}

│✧ *${groups.length}* Grup

│✧ *${chats.length - groups.length}* Chat Pribadi

│✧ *${Object.keys(global.db.data.users).length}* Pengguna

│✧ ${block == undefined ? '*0* Diblokir' : '*' + block.length + '* Diblokir'}

│✧ *${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}* Chat Terbanned

│✧ *${Object.entries(global.db.data.users).filter(user => user[1].banned).length}* Pengguna Terbanned

╰────────────⬣

┌───〔 Pengaturan 〕───⬣

│✧ ${anon ? '✅' : '❌'} *Anon Chat*

│✧ ${anticall ? '✅' : '❌'} *Anti Call*

│✧ ${antispam ? '✅' : '❌'} *Anti Spam*

│✧ ${antitroli ? '✅' : '❌'} *Anti Troli*

│✧ ${backup ? '✅' : '❌'} *Auto Backup DB*

│✧ ${groupOnly ? '✅' : '❌'} *Mode Grup*

│✧ ${jadibot ? '✅' : '❌'} *Jadi Bot*

│✧ ${nsfw ? '✅' : '❌'} *Mode Nsfw*

╰────────────⬣`

m.reply(sts)

}

handler.help = ['botstat']

handler.tags = ['info']

handler.command = /^botstat?$/i

export default handler

function clockString(ms) {