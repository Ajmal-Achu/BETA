// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

//import { bold } from "chalk"
let handler = async (m, { mufar, text }) => {
   
   if (!text) return m.reply('_Masukkan Nama Grup!_')
   try{
    m.reply(wait)
    let group = await mufar.groupCreate(text, [m.sender])
    let link = await mufar.groupInviteCode(group.gid)
    let url = 'https://chat.whatsapp.com/' + link;
 /// console.log(chalk.bold.red('Membuat Grup: ' + group.gid + '\nNama Grup: ' + text + '\n\nViolet'))
    m.reply('_Berhasil Membuat Grup *' + text + '*_\n\n*Nama:* ' + text + '\n*ID:* ' + group.gid + '\n*Link:* ' + url)
       } catch (e) {
    m.reply(`Error`)
  }
}
handler.help = ['creategroup']
handler.tags = ['owner']
handler.command = /^((create|buat)(gc|grup|group))$/
handler.owner = true
handler.premium = false
export default handler