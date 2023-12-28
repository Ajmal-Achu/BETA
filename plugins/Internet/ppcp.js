// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from "node-fetch" 
 let handler = async (m, { mufar }) => { 
  
   let data = await (await fetch('https://raw.githubusercontent.com/ShirokamiRyzen/WAbot-DB/main/fitur_db/ppcp.json')).json() 
   let cita = data[Math.floor(Math.random() * data.length)] 
  
   let cowi = await(await fetch(cita.cowo)).buffer() 
   await mufar.sendFile(m.chat, cowi, '', 'cowok ♂️', m) 
   let ciwi = await(await fetch(cita.cewe)).buffer() 
   await mufar.sendFile(m.chat, ciwi, '', 'cewek ♀️', m) 
 } 
  
 handler.help = ['ppcp'] 
 handler.tags = ['internet'] 
 handler.command = /^ppcp$/i
  
 export default handler