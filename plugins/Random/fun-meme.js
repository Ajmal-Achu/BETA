// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch';

let handler = async (m, { mufar }) => {
  m.reply('Tunggu sebentar...');

  let apiUrl = 'https://skizo.tech/api/randommeme?apikey=mufar';
  
  let res = await fetch(apiUrl);
  let json = await res.json();

  if (json.caption && json.media) {
    let caption = json.caption;
    let mediaUrl = json.media;
    
    await mufar.sendFile(m.chat, mediaUrl, '', caption, m);
  } else {
    throw 'Gagal memuat meme acak';
  }
};

handler.help = ['meme'];
handler.tags = ['random'];
handler.command = /^(meme)$/i;
handler.limit = true;

export default handler;