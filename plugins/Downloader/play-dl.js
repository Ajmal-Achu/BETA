import { youtubedl, youtubedlv2 } from '@bochilteam/scraper' 
import yts from 'yt-search'
var handler = async (m, { mufar, command, text, usedPrefix }) => {
  try {
    if (!text) { 
        return mufar.sendMessage(m.chat, {text: `Gunakan contoh ${usedPrefix}${command} 7!! Orange` },{quoted: m,ephemeralExpiration: ephemeral});
    }

    const pesan = await mufar.sendMessage(m.chat, {text:'Tunggu sebentar, sedang dicari dan diunduh...'});

    let search = await yts(text);
    let vid = search.videos[0];
  if (!search) throw 'Video Not Found, Try Another Title';
    let { authorName, title, thumbnail, duration, viewH, publishedTime, url } = vid;

    let caption = `╭──── 〔 Y O U T U B E 〕 ─⬣
⬡ Judul: ${title}
⬡ Author: ${authorName}
⬡ Durasi: ${duration}
⬡ Views: ${viewH}
⬡ Upload: ${publishedTime}
⬡ Link: ${url}
╰────────⬣`;

    //mufar.sendMessage(m.chat, {text: caption});

    const yt = await youtubedl(url).catch(async (_) => await youtubedlv2(url));
    const link = await yt.audio['128kbps'].download();
      let doc = {
                audio: {url:link},
                mimetype: "audio/mp4",
                ptt: true,
                fileName: `${title}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        mediaType: 2,
                        mediaUrl: url,
                        title: title,
                        body: ".M.U.F.A.R.",
                        sourceUrl: url,
                        thumbnailUrl: thumbnail 
                    }
                }
            }
await mufar.sendMessage(m.chat, doc, {
                quoted: m, 
                ephemeralExpiration: ephemeral 
            })
//await mufar.sendMessage(m.chat, {deleted: pesan.key})
      //mufar.sendMessage(m.chat, doc, { quoted: m });
  } catch (error) {
    console.error(error);
    m.reply(error);
  }
};

handler.help = ['play'].map((v) => v + ' <pencarian>')
handler.tags = ['downloader']
handler.command = /^play$/i

handler.exp = 0
handler.register = true

export default handler