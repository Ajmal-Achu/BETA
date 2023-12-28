import JavaScriptObfuscator from 'javascript-obfuscator';
import fs from 'fs';
import AdmZip from 'adm-zip';

const handler = async (m, { mufar }) => {
  if (!m.quoted) {
    return mufar.reply(m.chat, 'Harap reply ke pesan yang akan diobfuskasi.', m);
  }

  const quotedMsg = m.quoted;

  if (quotedMsg.mtype) {
    if (quotedMsg.mtype === 'extendedTextMessage' && quotedMsg.text) {
      // Mengobfuskasi pesan teks yang di-quote
      const inputCode = quotedMsg.text;
      const obfuscationResult = JavaScriptObfuscator.obfuscate(inputCode, {
        compact: false,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        selfDefending: true
      });

      // Mengirim pesan sebagai file .js
      mufar.sendFile(m.chat, Buffer.from(obfuscationResult.getObfuscatedCode()), 'obfuscated.js', '', m);

      // Menampilkan pesan ke konsol
      const consoleLogMessage = '\n' + obfuscationResult.getObfuscatedCode();
      console.log(consoleLogMessage);

      // Mengirim pesan ke obrolan menggunakan m.reply
      mufar.reply(m.chat, consoleLogMessage, m);
    } else if (quotedMsg.mimetype === 'application/javascript' || quotedMsg.mimetype === 'application/json') {
      // Mengambil file .js yang di-quote
      const fileName = await mufar.downloadAndSaveMediaMessage(quotedMsg);
      const fileContent = fs.readFileSync(fileName, 'utf-8');

      // Mengobfuskasi isi file .js
      const obfuscationResult = JavaScriptObfuscator.obfuscate(fileContent, {
        compact: false,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        selfDefending: true
      });

      // Mengirim pesan sebagai file .js
      mufar.sendFile(m.chat, Buffer.from(obfuscationResult.getObfuscatedCode()), 'obfuscated.js', '', m);
      fs.unlinkSync(fileName); // Menghapus file sementara

      // Menampilkan pesan ke konsol
      const consoleLogMessage = `\n` + obfuscationResult.getObfuscatedCode();
      console.log(consoleLogMessage);

      // Mengirim pesan ke obrolan menggunakan m.reply
      mufar.reply(m.chat, consoleLogMessage, m);
    } else if (quotedMsg.mimetype === 'application/zip') {
      // Mengunduh file .zip yang di-quote
      const zipFileName = await mufar.downloadAndSaveMediaMessage(quotedMsg);

      // Mengekstrak isi file .zip
      const zip = new AdmZip(zipFileName);
      const zipEntries = zip.getEntries();
      
      const successfulObfuscatedFiles = new AdmZip();
      const failedObfuscationFiles = new AdmZip();
      const failedFilesList = [];

      for (const entry of zipEntries) {
        if (entry.entryName.endsWith('.js')) {
          // Mengambil file .js di dalam .zip
          const jsContent = zip.readAsText(entry);
          try {
            const obfuscationResult = JavaScriptObfuscator.obfuscate(jsContent, {
              compact: false,
              controlFlowFlattening: true,
              deadCodeInjection: true,
              selfDefending: true
            });
            zip.updateFile(entry.entryName, Buffer.from(obfuscationResult.getObfuscatedCode()));
            successfulObfuscatedFiles.addFile(entry.entryName, Buffer.from(obfuscationResult.getObfuscatedCode()));
          } catch (error) {
            failedObfuscationFiles.addFile(entry.entryName, Buffer.from(jsContent));
            failedFilesList.push({ fileName: entry.entryName, reason: error.message });
          }
        }
      }

      // Menyimpan .zip yang telah diobfuskasi dan yang gagal diobfuskasi
      const obfuscatedZipName = 'obfuscated.zip';
      const failedObfuscationZipName = 'failedObfuscation.zip';
      zip.writeZip(obfuscatedZipName);
      successfulObfuscatedFiles.writeZip(failedObfuscationZipName);
      mufar.sendFile(m.chat, obfuscatedZipName, obfuscatedZipName, '', m);
      mufar.sendFile(m.chat, failedObfuscationZipName, failedObfuscationZipName, '', m);

      // Menghapus file .zip sementara
      fs.unlinkSync(zipFileName);
      fs.unlinkSync(obfuscatedZipName);
      fs.unlinkSync(failedObfuscationZipName);

      // Menampilkan pesan ke konsol
      const consoleLogMessage = `File .zip telah diobfuskasi: ${obfuscatedZipName}`;
      console.log(consoleLogMessage);

      // Mengirim pesan ke obrolan menggunakan m.reply
      mufar.reply(m.chat, consoleLogMessage, m);

      // Kirim pesan list file yang gagal beserta alasan gagal
      if (failedFilesList.length > 0) {
        const failedFilesMessage = `Files failed to obfuscate:\n${failedFilesList.map(file => `${file.fileName}: ${file.reason}`).join('\n')}`;
        mufar.reply(m.chat, failedFilesMessage, m);
      }
    } else {
      mufar.reply(m.chat, 'Format tidak didukung', m);
    }
  } else {
    mufar.reply(m.chat, 'Format tidak didukung', m);
  }
};

handler.command = /^obfuscate$/i;

export default handler;