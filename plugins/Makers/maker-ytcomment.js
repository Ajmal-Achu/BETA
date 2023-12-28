// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

let handler = async (m, { mufar, text }) => {

if (!text) throw 'No Text'

mufar.sendFile(m.chat, global.API('https://some-random-api.com', '/canvas/misc/youtube-comment', {

avatar: await mufar.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),

comment: text,

username: mufar.getName(m.sender)

}), 'error.png', '*THANKS FOR COMMENT*', m)

}

handler.help = ['ytcomment <comment>']

handler.tags = ['maker'] 

handler.command = /^(ytcomment)$/i

export default handler