// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let mufar = async (m, { mufar }) => {
  // Create an object to store tag counts and help counts
  const tagCounts = {};
  let totalHelpCount = 0;

  // Iterate through all plugins to count help entries for each tag
  Object.values(global.plugins).forEach((plugin) => {
    if (plugin.tags) {
      plugin.tags.forEach((tag) => {
        const helpArray = Array.isArray(plugin.help) ? plugin.help : [plugin.help];
        if (tagCounts[tag]) {
          tagCounts[tag] += helpArray.length;
        } else {
          tagCounts[tag] = helpArray.length;
        }
        totalHelpCount += helpArray.length;
      });
    }
  });

  // Sort the tagCounts object by count in descending order
  const sortedTagCounts = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [tag, count]) => {
      acc[tag] = count;
      return acc;
    }, {});

  // Generate a message with sorted tag and help counts
  const tagList = Object.entries(sortedTagCounts)
    .map(([tag, count]) => {
      const countText = `${count}`;
      return `║ꕥ ${tag.padEnd(15, ' ')} ║ ${countText.padStart(3, ' ')} ║`;
    }).join('\n');

  // Include the total tag and help counts in the message
  const message = `║ TAG${' '.repeat(13)}〚 COUNT 〛\n╟─┈─┄─┈─┄─┈─┄─┄─┈─┄╼\n${tagList}\n║ꕥ Total${' '.repeat(10)} ║ ${totalHelpCount}${' '.repeat(1)}║`;

  // Decorative square borders
  const squareTopBorder = '╓─┈─┄─┈─┄─┈─┄─┄─┈─┄╼';
  const squareBottomBorder = '╘─┈─┄─┈─┄─┈─┄─┄─┈─┄╼';

  // Add the square borders to the message
  const borderedMessage = `\`\`\`${squareTopBorder}\`\`\`\n\`\`\`${message}\`\`\`\n\`\`\`${squareBottomBorder}\`\`\``;

  mufar.sendMessage(m.chat, { text: borderedMessage, contextInfo: { externalAdReply: { title: wm, body: bottime, mediaType: 1, thumbnailUrl: 'https://telegra.ph/file/ea6c9f2084308771ebd21.jpg', sourceUrl: 'https://Javanese', renderLargerThumbnail: true }}}, { quoted: m, ephemeralExpiration: global.ephemeral });
}

mufar.help = ['totalfitur']
mufar.tags = ['info']
mufar.command = ['totalfitur']
export default mufar;
