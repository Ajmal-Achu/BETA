// Klo mau pake, pake aja ini bkn enc cma terser aja

// Klo mau pake, pake aja ini bkn enc cma terser aja

import fetch from "node-fetch";
import api from "dhn-api"
let handler = async (m, { mufar, args, text, usedPrefix, command }) => {
let f = await api.Cerpen(text)
m.reply(f)
}
handler.help = ['cerpen']
handler.tags = ['random']
handler.command = /^(cerpen)$/i;
export default handler;