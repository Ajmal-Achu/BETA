// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch';

const handler = async (m, { text, mufar }) => {
  if (!text) throw 'apa cuba';
  try {
    let wtf = await fetch(`https://xzn.wtf/api/oploverz?search=${encodeURIComponent(text)}&apikey=mufar`);
    let fak = await wtf.json();
    let str = `Oploverz Search\n\n`;
    for (let i = 0; i < fak.length; i++) {
      str += "```" + "Title: " + fak[i].title + '\n';
      str += "Link: " + fak[i].link + '\n';
      str += "Type: " + fak[i].type + '\n';
      str += "Image: " + fak[i].img + '\n\n' + "```";

      // Mengirim gambar
      mufar.sendFile(m.chat, fak[i].img, '', str, m);
    }
  } catch (e) {
    m.reply("Maaf, Tidak Ditemukan");
  }
};

handler.help = handler.command = ['oploverzs'];
handler.tags = ['anime'];

export default handler;