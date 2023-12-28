// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import canvafy from "canvafy";
import {
    promises as fsPromises
} from 'fs';
import {
    createHash
} from "crypto";
import fetch from "node-fetch";
let Reg = /\|?(.*)([^\w\s])([0-9]*)$/i;

let handler = async (m, {
    mufar,
    usedPrefix,
    command,
    text
}) => {
    mufar.registrasi = mufar.registrasi || {};
    if (mufar.registrasi[m.chat]) return mufar.reply(m.chat, 'Anda masih berada dalam sesi Registrasi', mufar.registrasi[m.chat].msg)
    let user = global.db.data.users[m.sender];
    if (user.registered === true) throw `[💬] Kamu sudah terdaftar\nMau daftar ulang? *${usedPrefix}unreg <SERIAL NUMBER>*`;
    const umurRandom = Math.floor(Math.random() * 100) + 1;
    const formatSalah = `⚠️ Format salah\n\n✳️ Penggunaan perintah : *${usedPrefix + command} nama.umur*\n📌Contoh : *${usedPrefix + command}* ${m.sender.split('@')[0]}.${umurRandom}`;
    if (!Reg.test(text)) throw formatSalah;
    let [_, name, splitter, age] = text.match(Reg);
    if (!name) throw "Nama tidak boleh kosong (Alphanumeric)";
    if (!age) throw "Umur tidak boleh kosong (Angka)";
    age = parseInt(age);
    if (age > 30) throw "*Gak boleh!*,\nTua amat dah 🗿";
    if (age < 5) throw "*Gak boleh!*,\nBanyak pedo 🗿";
    if (user.name && user.name.trim() === name.trim()) throw "Nama sudah dipakai";
    try {
        let sn = createHash("md5").update(m.sender).digest("hex");
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.fromMe ? mufar.user.jid : m.sender;
        let pp = await mufar.profilePictureUrl(who, "image").catch(_ => logo);

        let caption = `
*VERIFIKASI BERHASIL*

• *Nama:* ${name}
• *Umur:* ${age} tahun
• *Serial Number (SN):* ${sn}

🚀 Sekarang kamu dapat menggunakan fitur-fitur khusus yang hanya tersedia untuk pengguna terverifikasi.
`;

        const json = await createOtpCanvas(pp);
        let confirm = "💡 Reply pesan ini dengan mengetik kode OTP yang ada pada gambar!";
        let txt = `📝 *Registrasi* 📝\n\n@${m.sender.split('@')[0]}\n${confirm}\n\n_( Berlaku 1X )_`
        let msg = await mufar.sendMessage(m.chat, {
            image: json.image,
            caption: txt,
            mentions: [m.sender],
        }, {
            quoted: m
        });
        mufar.registrasi[m.chat] = {
            OTP: json.otp,
            VERIFIED: json.verified,
            CAPTION: caption,
            MSG: msg,
            NAME: name,
            AGE: age,
            timeout: setTimeout(() => {
                mufar.sendMessage(m.chat, { delete: msg.key });
                delete mufar.registrasi[m.chat];
            }, 60 * 1000)
        }
    } catch (e) {
        console.log(e)
        await m.reply(eror)
    }
}
handler.help = ["daftar", "register"].map(v => v + " <nama>.<umur>");
handler.tags = ["xp"];
handler.command = /^(register|verify|daftar|reg(is)?|verif)$/i;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function isNumber(x) {
    return !isNaN(x);
}

function generateRandomCharacter() {
    const characters = '0123456789';
    return characters[Math.floor(Math.random() * characters.length)];
}

async function createOtpCanvas(avatar) {
    const codetext = Array.from({
        length: 4
    }, generateRandomCharacter).join('');
    const captchaBuffer = await new canvafy.Captcha()
        .setBackground("image", "https://telegra.ph/file/a5358d5d9fcfb750f0a72.jpg")
        .setCaptchaKey(codetext.toString())
        .setBorder("#f0f0f0")
        .setOverlayOpacity(0.6)
        .build();
    const securityBuffer = await new canvafy.Security()
        .setAvatar(avatar)
        .setBackground("image", "https://telegra.ph/file/a5358d5d9fcfb750f0a72.jpg")
        .setCreatedTimestamp(Date.now())
        .setSuspectTimestamp(1)
        .setBorder("#f0f0f0")
        .setLocale("id") // country short code - default "en"
        .setAvatarBorder("#f0f0f0")
        .setOverlayOpacity(0.6)
        .build();
    return {
        image: captchaBuffer,
        otp: codetext,
        verified: securityBuffer
    };
}