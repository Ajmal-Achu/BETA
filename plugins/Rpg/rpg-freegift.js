// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar, args, usedPrefix }) => {
  const user = global.db.data.users[m.sender];
  const today = new Date().toLocaleDateString();
  const cooldownDuration = 86400000; // 1 day in milliseconds

  // Merge codes from mufar.freegift[m.sender].code array with validGiftCodes (removing duplicates)
  const validGiftCodes = [
    ...new Set([
      'code',
      'followfangz_',
      'BloowwXx',
      'BbL016JJQBCSr54OwwW0',
      'giftkey01389320007',
      'kode013923',
      ...(mufar.freegift && mufar.freegift[m.sender] && mufar.freegift[m.sender].code ? mufar.freegift[m.sender].code : [])
    ])
  ];

  if (mufar.freegift && mufar.freegift[m.sender] && mufar.freegift[m.sender].time === today) {
    const remainingCooldown = user.lastGift + cooldownDuration - new Date();
    const remainingTime = getRemainingTime(remainingCooldown);

    return mufar.reply(m.chat, `🎁 Kamu sudah menggunakan kode Gift Gratis hari ini. Kode Gift hanya bisa digunakan sekali sehari!\n\nKode Gift Gratis dapat digunakan kembali setelah:\n${remainingTime}\n\nKetik *${usedPrefix}buygift* untuk membeli kode gift premium`, m);
  }

  if (!args[0]) {
    return mufar.reply(m.chat, `❓ Kamu belum memasukkan Kode FreeGiftmu!\n\nContoh: *${usedPrefix}freegift code*`, m);
  }

  if (validGiftCodes.includes(args[0])) {
    mufar.reply(m.chat, '*🎉 SELAMAT!*\nKamu telah mendapatkan:\n💠 1000 XP\n🎫 1 Limit\n💹 1000 Money\n🥤 1 Potion', m);
    user.exp += 1000;
    user.limit += 1;
    user.money += 1000;
    user.potion += 1;

    // Set the session to mark that the user has used the gift code today
    if (!mufar.freegift) mufar.freegift = {};
    mufar.freegift[m.sender] = { time: today };

    // Set timeout for gift code usage (1 day)
    setTimeout(() => {
      delete mufar.freegift[m.sender];
      mufar.reply(m.chat, '⏰ Waktunya menggunakan FreeGift lagi!\nKetik *freegift* untuk mendapatkan hadiah spesial.', m);
    }, cooldownDuration);
  } else {
    mufar.reply(m.chat, `*❌ KODE FREE TIDAK VALID  ❌*\nSilakan periksa kembali Kode FreeGift yang kamu masukkan.\n\nContoh: *${usedPrefix}freegift code*`, m);
  }
};

handler.help = ['freegift <kode>'];
handler.tags = ['rpg'];
handler.command = /^freegift$/i;

export default handler;

function getRemainingTime(ms) {
  let days = Math.floor(ms / 86400000);
  let hours = Math.floor((ms % 86400000) / 3600000);
  let minutes = Math.floor((ms % 3600000) / 60000);
  let seconds = Math.floor((ms % 60000) / 1000);

  let remainingTime = '';
  if (days > 0) remainingTime += `${days} hari `;
  if (hours > 0) remainingTime += `${hours} jam `;
  if (minutes > 0) remainingTime += `${minutes} menit `;
  if (seconds > 0) remainingTime += `${seconds} detik`;

  return remainingTime.trim();
}
