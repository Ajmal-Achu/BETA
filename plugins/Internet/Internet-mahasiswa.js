// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from 'node-fetch';

var handler = async (m, { mufar, text }) => {
  if (!text) throw `*_Masukan Nama Mahasiswa/Siswa Yang Ingin Kamu Cari !_*`;
  mufar.reply(m.chat, 'Sedang mencari Orangnya... Silahkan tunggu', m);
  let res = await fetch('https://api-frontend.kemdikbud.go.id/hit_mhs/' + text);
  if (!res.ok) throw 'Tidak Ditemukan';
  let json = await res.json();
  let message = '';

  json.mahasiswa.forEach(data => {
    let nama = data.text;
    let websiteLink = data['website-link'];
    let website = `https://pddikti.kemdikbud.go.id${websiteLink}`;
    message += `\nNama = ${nama}\n\nData Ditemukan pada website = ${website}\n\n\n`;
  });
  
  mufar.reply(m.chat, message, m);
  }

handler.help = ['mahasiswa']
handler.tags = ['internet']
handler.command = /^(mahasiswa)$/i
handler.limit = true

export default handler