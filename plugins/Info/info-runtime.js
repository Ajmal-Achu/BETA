// Klo mau pake, pake aja ini bkn enc cma terser aja
//import { InfoCardBuilder } from 'discord-card-canvas'
import fs from 'fs'
import request from 'request-promise'
import {
  pickRandom
}
from '../../lib/other-function.js'
let handler = async ( m, {
  mufar,
  text,
  usedPrefix,
  command
} ) => {
await mufar.sendMessage(m.chat, {
        react: {
        text: '⌛',
        key: m.key }});
let res = await request('https://aemt.me/runtime', {json: true })    
    
  //let {key} = await mufar.sendMessage(m.chat, {text:wait})
  let _uptime = process.uptime( ) * 1000
  let uptime = clockString( _uptime )
  let url = `https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=426&scaleHeight=150&fontsize=200&fillTextType=1&fillTextPattern=Warning!&text=${res}`
  //let buffer = await (await fetch(url)).buffer
  
 

  
  
  
  
  
  let a2 = pickRandom( global.AraChu2 )
  await mufar.sendMessage( m.chat, {
    document: fs.readFileSync( './package.json' ),
    jpegThumbnail: await mufar.resize( url, 426, 150 ), //426×150
    fileLength: 920000,
    pageCount: 10701,
    fileName: 'OnLasdan',
    mimetype: [dpptx, ddocx, dxlsx, dpdf, drtf].getRandom(),
    caption: res,
    contextInfo: {
      externalAdReply: {
        thumbnail: global.tumbnil,
        thumbnailUrl: a2,
        mediaType: 1,
        title: wm,
        body: global.author,
        renderLargerThumbnail: true,
      }
    }
  }, {
quoted: m,
ephemeralExpiration: ephemeral
      })
    await mufar.sendMessage(m.chat, {
        react: {
        text: '',
        key: m.key }});
   //await mufar.sendMessage(m.chat, { delete: key })
}
handler.help = ['runtime']
handler.tags = ['info']
handler.command = /^((up|run)time)$/i
export default handler
function clockString(ms) {
	let h = isNaN(ms) ? '--' : Math.floor(ms % (3600 * 24) / 3600)
	let m = isNaN(ms) ? '--' : Math.floor(ms % 3600 / 60)
	let s = isNaN(ms) ? '--' : Math.floor(ms % 60)
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
