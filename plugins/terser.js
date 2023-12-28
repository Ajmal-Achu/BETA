// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import { minify } from 'terser';

const handler = async (m, { mufar, args }) => {
  if (!m.quoted) {
    return mufar.reply(m.chat, '👾 Silakan cantumkan pesan dengan kode yang akan diminify.', m);
  }

  const quotedCode = m.quoted.text || m.quoted.caption || '';

  if (!quotedCode.trim()) {
    return mufar.reply(m.chat, '👾 Pesan yang dikutip tidak mengandung kode.', m);
  }

  const options = {
  mangle: {
    toplevel: true,
    keep_classnames: true,
    ie8: false,
    properties: {
      regex: /^_/ // Hanya memendekkan properti yang dimulai dengan garis bawah
    },
    reserved: ['yourFunctionName'], // Ganti 'yourFunctionName' dengan nama fungsi yang ingin dihindari pemendekan
  // keep_quoted_props: true // Mengonfigurasi Terser untuk tetap menjaga properti yang diawali tanda kutip
  },
  compress: {
    toplevel: true,
    unsafe: true,
    passes: 20, // Tingkat maksimal passes
    sequences: true,
    dead_code: true,
    conditionals: true,
    booleans: true,
    unused: true,
    if_return: true,
    join_vars: true,
    pure_getters: true,
    unsafe_comps: true,
    keep_fargs: false,
    keep_infinity: true,
    hoist_funs: true,
    hoist_vars: true,
    collapse_vars: true,
    reduce_vars: true,
    side_effects: true
  },
  output: {
    beautify: false,
    comments: false,
    quote_keys: true
  }
};


  try {
    const result = await minify(quotedCode, options);
    if (result.error) {
        console.log(error)
      mufar.reply(m.chat, '👾 Terjadi kesalahan saat melakukan minifikasi kode.' + error, m);
    } else {
      mufar.reply(m.chat, result.code, m);
    }
  } catch (error) {
      console.log(error)
    mufar.reply(m.chat, '👾 Terjadi kesalahan saat melakukan minifikasi kode.' + error, m);
  }
};

handler.command = /^terser$/i;

export default handler;
