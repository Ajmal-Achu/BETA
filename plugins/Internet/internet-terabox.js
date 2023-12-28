// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch';

let handler = async (m, { mufar, args }) => {
  if (!args[0]) throw 'Masukkan link.\nContoh: *.tera https://www.4funbox.com/wap/share/filelist?surl=9JnFO9C3BX-ggDStXMDRkA';
  
  m.reply('Tunggu sebentar...');

  let url = encodeURIComponent(args[0]);
  let apiUrl = `https://xzn.wtf/api/teraboxdl?url=${url}&apikey=mufar`;
  
  let res = await fetch(apiUrl);
  let json = await res.json();

  if (json.list && json.list.length > 0) {
    let fileInfo = json.list[0];
    let message = `
Nama File: ${fileInfo.filename}
Ukuran File: ${fileInfo.filesize}
Tanggal: ${fileInfo.date}
Tautan Langsung: ${fileInfo.direct_link}
    `;
    await mufar.reply(m.chat, message, m);
  } else {
    throw 'Tidak ada tautan langsung yang ditemukan';
  }
};

handler.help = ['tera'];
handler.tags = ['internet'];
handler.command = /^(tera)$/i;
handler.limit = true;

export default handler;