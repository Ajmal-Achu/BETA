// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja


let handler = async ( m, { mufar, text, args, command}) => {
  mufar.duel = mufar.duel ? mufar.duel : []
  args.length != 0 ? mufar.duel.push(m.mentionedJid ? m.mentionedJid[0] : (args[0].replace(/[@ .+-]/g, '').replace(' ', '') + '@s.whatsapp.net')) : ""
  let who = mufar.duel[0]
  //let kita = mufar.duel[m.sender]
  let enemy = global.db.data.users[who]
  let user = global.db.data.users[m.sender]
  let count = args[1] && args[1].length > 0 ? Math.min(100, Math.max(parseInt(args[1]), 1)) : Math.min(1)
  let nama = await mufar.getName(m.sender)

  let randomaku = `${Math.floor(Math.random() * 101)}`.trim()
  let randomkamu = `${Math.floor(Math.random() * 81)}`.trim()
  let Aku = (randomaku * 1)
  let Kamu = (randomkamu * 1)

  let __timers = (new Date - user.lastduel)
  let _timers = (300000 - __timers) 
  let timers = clockString(_timers)

   try {
     if (/duel/.test(command)) {
       if (!who) return m.reply('tag yg ingin di ajak duel!')

     let pler = `@${m.sender.replace(/@.+/, '')} Mengajak duel ${args[0]}\n\nPilih Y Atau No`
     let mentionedJid = [m.sender]

       if (new Date - user.lastduel > 300000) {
      mufar.reply(m.chat, pler, m, { mentions: mufar.parseMention(mentionedJid) })

      } else mufar.reply( m.chat, `Kamu Sudah Berduel Tunggu hingga ${timers}`, m)
     }

     if (/dya/.test(command)) {
     let kenal = !who.includes(m.sender)
     if(kenal) throw 'Lu siapa?\nkok ikut kut mau duel'
     user.lastduel = new Date * 1
     if (Aku > Kamu) {
       user.money -= 900
       enemy.money += 900
       delete mufar.duel[m.sender]
       mufar.reply(m.chat, `@${who.split("@")[0]} Menang Gelud🤼\n*Hadiah:*\n900 Money buat beli gorengan`.trim(), m)
     } else if (Aku < Kamu) {
       user.money += 450
       enemy.money -= 450
       delete mufar.duel[m.sender]
       mufar.reply(m.chat, `@${who.split("@")[0]} Kalah Gelud🤼\n*Hadiah:*\n 450 money Mayan buat beli Limit`.trim(), m)
     } else {
       user.money += 250
       enemy.money += 250
       delete mufar.duel[m.sender]
       mufar.reply(m.chat, `@${who.split("@")[0]}\n *Seri*\n masing masing 250 Money`.trim(), m)
     }
   }
   if (/dno/.test(command)) {
   let kenal = !who.includes(m.sender)
   if(kenal) return mufar.reply(m.chat, `Lu siapa?\nkok ikut kut mau duel`, m)
    //if (!who) return m.reply('tag yg ingin di ajak duel!')
    mufar.reply( m.chat, `@${who.split("@")[0]} Membatalkan Ajakan Duel`, m)
    delete mufar.duel[m.sender]
   }
 } catch (e) {
   //return mufar.sendBut( m.chat, `Sepertinya ada bug`, `laporkan ke owner`, `Kanjut Badag`, `+bug duel ${e.stack}`, m)
   return m.reply(`${e}`)
 }
}

handler.help = ['duel @tag']
handler.tags = ['rpg']
handler.command = /^(duel|dya|dno)/i
handler.group = true

export default handler 

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return ['\n' + d, ' *Days ☀️*\n ', h, ' *Hours 🕐*\n ', m, ' *Minute ⏰*\n ', s, ' *Second ⏱️* '].map(v => v.toString().padStart(2, 0)).join('')
}