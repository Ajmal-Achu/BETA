// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from "node-fetch"
import fs from 'fs'
let handler = async (m, {
    mufar,
    usedPrefix,
    text,
    args,
    command
}) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? mufar.user.jid : m.sender
    let pp = await mufar.profilePictureUrl(who).catch(_ => hwaifu.getRandom())
    let kamako = global.tumbnil
    let name = await mufar.getName(who)
    let ftroli = {
    key : {
    remoteJid: 'status@broadcast',
    participant : '0@s.whatsapp.net'
    },
    message: {
    orderMessage: {
    itemCount : 999999,
    status: 404,
    surface : 404,
    message: `itu owner yui kak\n✧(｡•̀ᴗ-)✧`, 
    orderTitle: ``,
    thumbnail: await (await fetch('https://telegra.ph/file/bc89b4b7c2cb29790181b.jpg')).buffer(), //Gambarnye
    sellerJid: '0@s.whatsapp.net' 
    }
    }
    }

    if (command == "owner") {
        let vcard = `BEGIN:VCARD
VERSION:3.0
N:WhatsApp;Masih pemula;;Md
FN:Masih pemula
NICKNAME:Masih pemula
ORG:Masih Pemula
TITLE:kamako
item1.TEL;waid=628970404980:+62 897-0404-980
item1.X-ABLabel:📞 Nomor Owner
item2.URL:lit.link/hikosova
item2.X-ABLabel:💬 More
item3.EMAIL;type=INTERNET:admin@hikosova.my.id
item3.X-ABLabel:Email Owner Kak
item4.ADR:;;🇮🇩 Indonesia;;;;
item4.X-ABADR:💬 More
item4.X-ABLabel:📍 Lokasi Saya
BDAY;value=date:🔖 12 Desember 1999
END:VCARD`;

let tag_own = await mufar.sendMessage(m.chat, {
  contacts: {
    displayName: wm,
    contacts: [
      {
        vcard: vcard
      }
    ]
  },
  contextInfo: {
      mentionedJid : [m.sender],
    externalAdReply: { // Isi Sendiri 
      renderLargerThumbnail: true,
      body: 'ini kak owner ku', 
      mediaUrl: sig,
      mediaType: 1,
      thumbnail: await fs.readFileSync("./thumbnail.jpg"), 
      sourceUrl: sig,
    }
  }
}, { quoted: ftroli });
        //await mufar.reply(m.chat, `Halo kak @${m.sender.split("@")[0]} itu nomor owner kamako kak, jangan di apa-apain ya kak😖`, tag_own, {
            //mentions: [m.sender]
        //})
    }
}
handler.help = ["owner"]
handler.tags = ["info"]
handler.command = /^(owner)$/i

export default handler

/*Made by xhumb_har
which delete wm hopefully the knowledge is gone*/