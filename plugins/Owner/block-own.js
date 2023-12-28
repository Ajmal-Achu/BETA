// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

/*let handler = async (m, { mufar }) => {

 let who
 if (m.isGroup) who = m.mentionedJid[0]
 else who = m.chat
 if (!who) throw 'Tag Orang yang mau diblock!'
 let user = `${who.split("@s.whatsapp.net")[0]}` + '@c.us'
    await mufar.blockUser(user, 'add')
  mufar.reply(m.chat, `Done!`, m)
}
handler.help = ['block <@user>']
handler.tags = ['owner']
handler.command = /^block$/i
handler.owner = true

module.exports = handler*/

let handler = async (m, { mufar, text, usedPrefix }) => {
	function no(number){
    return number.replace(/\s/g,'').replace(/([@+-])/g,'')
  }

	text = no(text)

  if(isNaN(text)) {
		var number = text.split`@`[1]
  } else if(!isNaN(text)) {
		var number = text
  }

  if(!text && !m.quoted) return mufar.reply(m.chat, `*❏ BLOCK NUMBER*\n\n• \`\`\`\Tag user:\`\`\`\ *${usedPrefix}block @Tag*\n• \`\`\`\Type Number:\`\`\`\ *${usedPrefix}block 6289654360447*\n• \`\`\`\Block User:\`\`\`\ *(Reply Your User)*`, m)
    if(isNaN(number)) return mufar.reply(m.chat, `*❏ BLOCK NUMBER*\n\n• \`\`\`\Tag user:\`\`\`\ *${usedPrefix}block @Tag*\n• \`\`\`\Type Number:\`\`\`\ *${usedPrefix}block 6289654360447*\n• \`\`\`\Block User:\`\`\`\ *(Reply Your User)*`, m)
    if(number.length > 15) return mufar.reply(m.chat, `*❏ BLOCK NUMBER*\n\n• \`\`\`\Tag user:\`\`\`\ *${usedPrefix}block @Tag*\n• \`\`\`\Type Number:\`\`\`\ *${usedPrefix}block 6289654360447*\n• \`\`\`\Block User:\`\`\`\ *(Reply Your User)*`, m) 
  try {
		if(text) {
			var user = number + '@s.whatsapp.net'
		} else if(m.quoted.sender) {
			var user = m.quoted.sender
		} else if(m.mentionedJid) {
  		  var user = number + '@s.whatsapp.net'
			}  
		} catch (e) {
  } finally {
  
	let groupMetadata = m.isGroup ? await mufar.groupMetadata(m.chat) : {}
  let participants = m.isGroup ? groupMetadata.participants : []
	let users = m.isGroup ? participants.find(u => u.jid == user) : {}
	let number = user.split('@')[0]
  
	await mufar.updateBlockStatus(user, "block")
 	
 	mufar.reply(m.chat, `Berhasil memblockir @${number}`, null, {contextInfo: {
    mentionedJid: [user]
 	}})

 
 }
}
handler.help = ['block <@user>']
handler.tags = ['owner']
handler.command = /^block$/i
handler.owner = true

export default handler