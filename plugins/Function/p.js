// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar, text, usedPrefix, command }) => {
const deleteMessage = { delete: { remoteJid: m.key.remoteJid, fromMe: false, id: m.key.id, participant: [m.sender] } };
await mufar.sendMessage(m.chat, deleteMessage);
mufar.sendMessage(m.chat, {text: 'lucu'},{quoted: m, ephemeralExpiration: global.ephemeral})
}

handler.customPrefix = /^(p)$/i
handler.command = new RegExp
export default handler