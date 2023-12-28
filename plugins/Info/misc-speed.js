// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

//Made By KORONEOFC/SAD-BOT
import os from 'os'
import cp from 'child_process'
import { promisify } from 'util'
let exec = promisify(cp.exec).bind(cp)
let handler = async (m, { mufar}) => {

const old = performance.now();
 const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";
 const free_ram = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";
 const serverInfo = `\`\`\`Server Information
- ${os.cpus().length} CPU: ${os.cpus()[0].model}
- Ram: ${free_ram}/${ram}
- Speed: ${(performance.now() - old).toFixed(5)} ms\`\`\``
 m.reply(serverInfo)
    
    }
handler.help = ['ping']
handler.tags = ['info']
handler.command = /^(ping)$/i

export default handler