// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

export async function before(m, { mufar, isBotAdmin }) {
  try {
    const mtype = m.mtype;
    const settings = {
      'audioMessage': { viewOnce: true },
      'videoMessage': { viewOnce: true },
      'imageMessage': { viewOnce: true },
      'documentMessage': { viewOnce: true }
    };
    const chat = global.db.data.chats[m.chat];
    if (settings[mtype] && chat.antiMedia) {
      let doc = m.mediaMessage;
      Object.assign(doc[mtype], settings[mtype]);
      await mufar.relayMessage(m.chat, doc, { quoted: m });

      const hapus = m.sender || m.participant;
      const bang = m.id;

      if (isBotAdmin) {
        return mufar.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: bang, participant: hapus } });
      }
    }
  } catch {
    throw 'Terjadi kesalahan';
  }
}