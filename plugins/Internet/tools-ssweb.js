// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async ( m, { mufar, usedPrefix, command, text } ) => {
  if ( !text ) { m.reply( 'link?' ) } else {
    await m.reply( `*_ᴛᴜɴɢɢᴜ sᴇʙᴇɴᴛᴀʀ_*` )
    mufar.sendFile( m.chat, `https://api.yanzbotz.my.id/api/other/ssweb?url=${text}&mode=desktop`, null, `Nih Nyaww~ 🐾💗`, m )
  }
}
handler.command = /^(ssweb)$/i
handler.premium = false
export default handler
