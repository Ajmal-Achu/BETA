// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import { download } from 'aptoide-scraper';

let handler = async (m, { mufar, usedPrefix: prefix, command, text }) => {

try {

if (command === 'apk') {

if (!text) throw `*[❗] Please provide the APK Name you want to download.*`;

await mufar.reply(m.chat, global.wait, m);

let data = await download(text);

if (data.size.replace(' MB', '') > 700) {

return await mufar.sendMessage(m.chat, { text: '*[⛔] The file is too large.*' }, { quoted: m });

}

if (data.size.includes('GB')) {

return await mufar.sendMessage(m.chat, { text: '*[⛔] The file is too large.*' }, { quoted: m });

}

await mufar.sendMessage(

m.chat,

{ document: { url: data.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: data.name + '.apk', caption: null },

{ quoted: m }

);

}

} catch {

throw `*[❗] An error occurred. Make sure to provide a valid link.*`;

}

};

handler.command = /^apk$/i;

export default handler