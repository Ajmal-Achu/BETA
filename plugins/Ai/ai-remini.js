// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch';
import uploadImage from '../../lib/uploadImage.js';

let handler = async (m, { mufar, usedPrefix, command, text }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? mufar.user.jid : m.sender;
  let name = await mufar.getName(who);
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  
  if (!mime) throw 'Kirim/Reply Gambar dengan caption .remini';
  
  m.reply('Tunggu Sebentar...');
  
  let media = await q.download();
  let url = await uploadImage(media);
  
  let response = await (await fetch(`https://vihangayt.me/tools/enhance?url=${url}`));

  if (!response.ok) {
    throw new Error(`Error HTTP! Status: ${response.status}`);
  }

  const buffer = await response.buffer();
  await mufar.sendFile(m.chat, buffer, '', global.wm, m);
}

handler.help = ['remini']
handler.tags = ['ai']
handler.command = /^(remini)$/i
handler.limit = 20

export default handler
