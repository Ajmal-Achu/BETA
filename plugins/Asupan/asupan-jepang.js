// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import {
  somematch
} from '../../lib/other-function.js'

const cecan = [ 'cecan2', 'china', 'cogan', 'indonesia', 'japan', 'korea', 'malaysia', 'thailand', 'vietnam' ]
const dosa = [ 'anony', 'bocil', 'harley', 'hijaber' ]
const random = [ 'blackpink', 'justina', 'kpop', 'rose', 'ryujin' ]
const join = [ 'random', ...cecan, ...dosa, ...random ]

let handler = async ( m, {
  mufar,
  text,
  usedPrefix,
  command
} ) => {
  text = text.toLowerCase( )
  if ( text && !join.some( v => v === text ) ) throw `Cecan *${text}* tidak tersedia, list cecan :\n\n${join.join(' | ')}`
  if ( !text ) text = join.getRandom( )
  if ( command !== 'cecan' ) text = command
  try {
    let folder
    if ( text == 'random' ) folder = [ 'cecan', 'dosa' ].getRandom( )
    else folder = somematch( cecan, text ) ? 'cecan' : somematch( dosa, text ) ? 'dosa' : 'image'
    let anu = await ( await fetch( `https://raw.githubusercontent.com/clicknetcafe/Databasee/main/${folder}/${text.replace('random','cecan')}.json` ) ).json( )
    // await mufar.sendFile(m.chat, anu.getRandom(), '', `Cecan > ${text}`, m)
    await mufar.sendMessage( m.chat, {
      image: {
        url: anu.getRandom()
      },
      caption: `Cecan > ${text}`,
      contextInfo: global.ppkecil.contextInfo,
    }, {
      quoted: m
    })
  } catch ( e ) {
    console.log( e )
    m.reply( `Cecan *${text}* sedang turu.` + `${e}`)
  }
}

handler.help = [ 'cecan <option>', 'cecan2', 'anony', 'bocil', 'china', 'harley', 'hijaber', 'indonesia', 'japan', 'korea', 'malaysia', 'thailand', 'vietnam' ]
handler.tags = [ 'random' ]
handler.command = /^(cecan2?|anony|bocil|china|harley|hijaber|indonesia|japan|korea|malaysia|thailand|vietnam)$/i

handler.premium = true
handler.limit = true

export default handler