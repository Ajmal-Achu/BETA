// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar, args, usedPrefix, command }) => {
    let isClose = args[0] || '';
    
    // Tentukan durasi awal dalam milidetik (default: 0)
    let closeDuration = 0;

    if (isClose === 'open') {
        // Jika perintah adalah untuk membuka grup, atur durasi ke 0 (tanpa penundaan)
        closeDuration = 0;
    } else if (isClose === 'close') {
        // Jika perintah adalah untuk menutup grup, periksa durasi (1m, 2m, 1j, 2j, dst.)
        const durationArg = args[1] || '';

        if (durationArg.match(/^(\d+)([mj])$/)) {
            // Parse angka dan unit (m untuk menit, j untuk jam)
            const durationValue = parseInt(RegExp.$1);
            const durationUnit = RegExp.$2;
            
            // Hitung durasi dalam milidetik
            if (durationUnit === 'm') {
                closeDuration = durationValue * 60 * 1000; // Menit ke milidetik
            } else if (durationUnit === 'j') {
                closeDuration = durationValue * 60 * 60 * 1000; // Jam ke milidetik
            }
        } else {
            // Jika format durasi salah, lemparkan pesan kesalahan
            throw `
*Format salah! Contoh :*
  *❌ ${usedPrefix + command} close 1m (1 menit)*
  *❌ ${usedPrefix + command} close 2j (2 jam)*
`.trim();
        }
    } else {
        // Jika perintah bukan open atau close, lemparkan pesan kesalahan
        throw `
*Format salah! Contoh :*
  *❌ ${usedPrefix + command} close 1m (1 menit)*
  *❌ ${usedPrefix + command} close 2j (2 jam)*
`.trim();
    }

    // Perbarui pengaturan grup ke 'announcement'
    await mufar.groupSettingUpdate(m.chat, 'announcement');

    // Setelah durasi yang ditentukan, perbarui pengaturan grup ke 'not_announcement' (buka)
    setTimeout(() => {
        mufar.groupSettingUpdate(m.chat, 'not_announcement');
    }, closeDuration);
}

handler.help = ['group'].map(v => v + ' <buka / tutup [1m/2m/1j/2j/dst.]>');
handler.tags = ['group'];
handler.command = /^(group|grup)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
export default handler;
