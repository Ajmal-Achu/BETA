// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch';

let handler = async (m, { mufar, usedPrefix, command }) => {
  await m.reply('Please wait...');

  try {
    let res = await fetch('https://raw.githubusercontent.com/ArifzynXD/database/master/asupan/korea.json');
    let json = await res.json();
    
    // Get a random URL from the fetched JSON
    const randomIndex = Math.floor(Math.random() * json.length);
    const randomURL = json[randomIndex].url;

    // Send the random image
    await mufar.sendFile(m.chat, randomURL, 'trap.png', '', m);
  } catch (error) {
    console.error('Error fetching and sending images:', error);
    await m.reply('An error occurred while fetching and sending images.');
  }
};

handler.tags = ['asupan'];
handler.help = handler.command = ['korea2'];
handler.nsfw = true;

export default handler;