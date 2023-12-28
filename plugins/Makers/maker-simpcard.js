// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar }) => { 
   let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? mufar.user.jid : m.sender 
   mufar.sendFile(m.chat, global.API('https://some-random-api.com', '/canvas/simpcard', { 
     avatar: await mufar.profilePictureUrl(who).catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'), 
   }), 'simpcard.png', 'simp', m) 
 } 
  
 handler.help = ['simpcard'] 
 handler.tags = ['maker'] 
  
 handler.command = /^(simpcard)$/i 
 export default handler