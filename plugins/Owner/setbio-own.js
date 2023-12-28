// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar, text }) => {
  if (!text) throw `uhm.. teksnya mana?`
  try {
    await mufar.setStatus(text)
    m.reply('Berhasil!')
  } catch (e) {
    console.log(e)
    throw `Eror`
  }
}
handler.help = ['setbio <teks>']
handler.tags = ['owner']
handler.command = /^set(bio|status)$/i
handler.owner = true

export default handler
