// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja
import { exec as _exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const exec = promisify(_exec);
let handler = async (m, { mufar, text }) => {
  if (!text) {
    m.reply('Mohon berikan nama file yang akan diambil');
    return;
  }

  const filename = `${text}`;

  try {
      
    m.reply('Tunggu sebentar, sedang mengambil file database');
    const sesi = await fs.promises.readFile(`./${filename}`);
    await mufar.sendMessage(m.chat, { document: sesi, mimetype: 'application/octet-stream', fileName: filename }, { quoted: m });
  } catch (error) {
    console.log(error);
    m.reply('Terjadi kesalahan dalam mengambil file database');
    
    // Set file permissions to 777 (read, write, and execute for everyone)
    try {
      
        await exec(`chmod 777 ${filename}`);
      m.reply('File permissions set to 777.');
    } catch (chmodError) {
      console.log(chmodError);
      m.reply('Tidak dapat mengatur izin file.');
    }
  }
};

handler.help = ['getzip <namafile>'];
handler.tags = ['owner'];
handler.command = /^(getzip)$/i;
handler.rowner = true;

export default handler;
