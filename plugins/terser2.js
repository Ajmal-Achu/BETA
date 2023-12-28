// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import { minify } from 'terser';

const handler = async (m, { mufar, args }) => {
  if (args.length === 0) {
    return mufar.reply(m.chat, 'Mohon sertakan kode yang akan diompresi.', m);
  }

  const inputCode = args.join(' ');

  const options = {
    mangle: false,
    compress: true,
  };

  try {
    const result = await minify(inputCode, options);
    if (result.error) {
      mufar.reply(m.chat, 'Terjadi kesalahan dalam mengompresi kode.', m);
    } else {
      mufar.reply(m.chat, result.code, m);
    }
  } catch (error) {
    mufar.reply(m.chat, 'Terjadi kesalahan dalam mengompresi kode.', m);
  }
};

handler.command = /^terser2$/i;

export default handler;