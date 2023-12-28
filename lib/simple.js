import path from 'path'
import {
    toAudio
} from './converter.js'
import chalk from 'chalk'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import util from 'util'
import {
    fileTypeFromBuffer
} from 'file-type'
import {
    format
} from 'util'
import {
    fileURLToPath
} from 'url'

import translate from '@vitalets/google-translate-api'
import Jimp from 'jimp'
const {
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid
} = (await import('./exif.js')).default
let conv = await import('./sticker.js')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @type {import('@whiskeysockets/baileys')}
 */
const {
    default: makeWASocket,
    makeWALegacySocket,
    proto,
    downloadContentFromMessage,
    jidDecode,
    areJidsSameUser,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateWAMessage,
    WAMessageStubType,
    extractMessageContent
} = (await import('@whiskeysockets/baileys')).default
import * as baileys from "@whiskeysockets/baileys";
import store from './store-single.js'

export function makeWaSocket(connectionOptions, options = {}) {
    /**
     * @type {import('@whiskeysockets/baileys').WASocket | import('@whiskeysockets/baileys').WALegacySocket}
     */
    let mufar = (global.opts['legacy'] ? makeWALegacySocket : makeWASocket)(connectionOptions)

    let sock = Object.defineProperties(mufar, {
        chats: {
            value: {
                ...(options.chats || {})
            },
            writable: true
        },
        decodeJid: {
            value(jid) {
                if (!jid || typeof jid !== 'string') return (!nullish(jid) && jid) || null
                return jid.decodeJid()
            }
        },
        logger: {
            get() {
                return {
                    info(...args) {
                        console.log(
                            chalk.bold.bgRgb(51, 204, 51)('INFO '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.cyan(format(...args))
                        )
                    },
                    error(...args) {
                        console.log(
                            chalk.bold.bgRgb(247, 38, 33)('ERROR '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.rgb(255, 38, 0)(format(...args))
                        )
                    },
                    warn(...args) {
                        console.log(
                            chalk.bold.bgRgb(255, 153, 0)('WARNING '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.redBright(format(...args))
                        )
                    },
                    trace(...args) {
                        console.log(
                            chalk.grey('TRACE '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.white(format(...args))
                        )
                    },
                    debug(...args) {
                        console.log(
                            chalk.bold.bgRgb(66, 167, 245)('DEBUG '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.white(format(...args))
                        )
                    }
                }
            },
            enumerable: true
        },
        sendMsg: {
			async value(jid, message = {}, options = {}) {
				return await mufar.sendMessage(jid, message, { ...options, backgroundColor: '', ephemeralExpiration: 86400 })
			},
			enumerable: true,
			writable: true
		},
        getFile: {
            /**
             * getBuffer hehe
             * @param {fs.PathLike} PATH 
             * @param {Boolean} saveToFile
             */
            async value(PATH, saveToFile = false) {
                let res, filename
                const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? PATH.toBuffer() : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
                if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
                const type = await fileTypeFromBuffer(data) || {
                    mime: 'application/octet-stream',
                    ext: '.bin'
                }
                if (data && saveToFile && !filename)(filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
                return {
                    res,
                    filename,
                    ...type,
                    data,
                    deleteFile() {
                        return filename && fs.promises.unlink(filename)
                    }
                }
            },
            enumerable: true
        },
        waitEvent: {
            /**
             * waitEvent
             * @param {String} eventName 
             * @param {Boolean} is 
             * @param {Number} maxTries 
             */
            value(eventName, is = () => true, maxTries = 25) { //Idk why this exist?
                return new Promise((resolve, reject) => {
                    let tries = 0
                    let on = (...args) => {
                        if (++tries > maxTries) reject('Max tries reached')
                        else if (is()) {
                            mufar.ev.off(eventName, on)
                            resolve(...args)
                        }
                    }
                    mufar.ev.on(eventName, on)
                })
            }
        },
        sendFile: {
            /**
             * Send Media/File with Automatic Type Specifier
             * @param {String} jid
             * @param {String|Buffer} path
             * @param {String} filename
             * @param {String} caption
             * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
             * @param {Boolean} ptt
             * @param {Object} options
             */
            async value(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) {
                let type = await mufar.getFile(path, true)
                let {
                    res,
                    data: file,
                    filename: pathFile
                } = type
                if (res && res.status !== 200 || file.length <= 65536) {
                    try {
                        throw {
                            json: JSON.parse(file.toString())
                        }
                    } catch (e) {
                        if (e.json) throw e.json
                    }
                }
                /*
                const fileSize = fs.statSync(pathFile).size / 1024 / 1024
                if (fileSize >= 1024) throw new Error('File size is too big!')
                */
                let opt = {}
                if (quoted) opt.quoted = quoted
                if (!type) options.asDocument = true
                let mtype = '',
                    mimetype = options.mimetype || type.mime,
                    convert
                if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
                else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
                else if (/video/.test(type.mime)) mtype = 'video'
                else if (/audio/.test(type.mime))(
                    convert = await toAudio(file, type.ext),
                    file = convert.data,
                    pathFile = convert.filename,
                    mtype = 'audio',
                    mimetype = options.mimetype || 'audio/ogg; codecs=opus'
                )
                else mtype = 'document'
                if (options.asDocument) mtype = 'document'

                delete options.asSticker
                delete options.asLocation
                delete options.asVideo
                delete options.asDocument
                delete options.asImage

                let message = {
                    ...options,
                    caption,
                    ptt,
                    [mtype]: {
                        url: pathFile
                    },
                    mimetype,
                    fileName: filename || pathFile.split('/').pop()
                }
                /**
                 * @type {import('@whiskeysockets/baileys').proto.WebMessageInfo}
                 */
                let m
                try {
                    m = await mufar.sendMessage(jid, message, {
                        ...opt,
                        ...options
                    })
                } catch (e) {
                    console.error(e)
                    m = null
                } finally {
                    if (!m) m = await mufar.sendMessage(jid, {
                        ...message,
                        [mtype]: file
                    }, {
                        ...opt,
                        ...options
                    })
                    file = null // releasing the memory
                    return m
                }
            },
            enumerable: true
        },
        sendThumb: {
			async value(jid, title, text = '', thumbnailUrl, sourceUrl, quoted, LargerThumbnail = true, AdAttribution = true) {
				return mufar.sendMsg(jid, { ...{
					contextInfo: {
						mentionedJid: await mufar.parseMention(text),
						externalAdReply: {
							title: title,
							body: null,
							mediaType: 1,
							previewType: 0,
							showAdAttribution: AdAttribution,
							renderLargerThumbnail: LargerThumbnail,
							thumbnailUrl: thumbnailUrl,
							sourceUrl: sourceUrl
						},
					},
				}, text }, { quoted })
			},
			enumerable: true,
			writable: true,
		},
        sendLoading: {
  async value(jid, m, text) {
    let arr = [
      `『 ⎔ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■□□□□□□□□□] 10%*`,
      `『 ⎔ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■■■□□□□□□□] 30%*`,
      `『 ⎔ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■■■■■□□□□□] 50%*`,
      `『 ⎔ 𝙻ᚲ𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■■■■■■■□□□] 70%*`,
      `『 ⎔ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■■■■■■■■■■] 100%*`,
      `ʟᴏᴀᴅɪɴɢ sᴜᴄᴄᴇssғᴜʟ`
    ];
    let { key } = await mufar.sendMessage(m.chat, { text: arr[0] });
    async function showLoading(index) {
      if (index >= arr.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 250));
        await mufar.sendMessage(m.chat, { text, edit: key });
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 2250));
      await mufar.sendMessage(m.chat, { text: arr[index], edit: key });
      showLoading(index + 1);
    }

    showLoading(1); // Mulai dari indeks 1 untuk melewati pesan teks di awal
  },
  enumerable: true,
  writable: true,          
},
editMessage: {
			value(jid, key, text = "", quoted, options) {
				return mufar.relayMessage(jid, {
					protocolMessage: {
						key,
						type: 14,
						editedMessage: {
							conversation: text
						}
					}
				}, {
					quoted,
					...options
				})
			},
			writeable: true,
		},

        /**
         * Send Contact
         * @param {String} jid 
         * @param {String[][]|String[]} data
         * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted 
         * @param {Object} options 
         */
        sendContact: {
            async value(jid, data, quoted, options) {
                if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
                let contacts = []
                for (let [number, name] of data) {
                    number = number.replace(/[^0-9]/g, '')
                    let njid = number + '@s.whatsapp.net'
                    let biz = await mufar.getBusinessProfile(njid).catch(_ => null) || {}
                    let vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, '\\n')}
ORG:
item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:Ponsel${biz.description ? `
item2.EMAIL;type=INTERNET:${(biz.email || '').replace(/\n/g, '\\n')}
item2.X-ABLabel:Email
PHOTO;BASE64:${(await mufar.getFile(await mufar.profilePictureUrl(njid)).catch(_ => ({})) || {}).number?.toString('base64')}
X-WA-BIZ-DESCRIPTION:${(biz.description || '').replace(/\n/g, '\\n')}
X-WA-BIZ-NAME:${name.replace(/\n/g, '\\n')}
` : ''}
END:VCARD
`.trim()
                    contacts.push({
                        vcard,
                        displayName: name
                    })

                }
                return mufar.sendMessage(jid, {
                    ...options,
                    contacts: {
                        ...options,
                        displayName: (contacts.length >= 2 ? `${contacts.length} kontak` : contacts[0].displayName) || null,
                        contacts,
                    }
                }, {
                    quoted,
                    ...options
                })
            },
            enumerable: true
        },
        /**
         * Send Contact
         * @param {String} jid 
         * @param {String[][]|String[]} data
         * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted 
         * @param {Object} options 
         */
        sendKontak: {
            async value(jid, data, quoted, options) {
                if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
                let contacts = []
                for (let [number, nama, ponsel, email] of data) {
                    number = number.replace(/[^0-9]/g, '')
                    let njid = number + '@s.whatsapp.net'
                    let name = global.db.data.users[njid] ? global.db.data.users[njid].name : mufar.getName(njid)
                    let biz = await mufar.getBusinessProfile(njid).catch(_ => null) || {}
                    let vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, '\\n')}
ORG:
item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:📌 ${ponsel}
item2.EMAIL;type=INTERNET:${email}
item2.X-ABLabel:✉️ Email
X-WA-BIZ-DESCRIPTION:${(biz.description || '').replace(/\n/g, '\\n')}
X-WA-BIZ-NAME:${name.replace(/\n/g, '\\n')}
END:VCARD
`.trim()
                    contacts.push({
                        vcard,
                        displayName: name
                    })

                }
                return mufar.sendMessage(jid, {
                    contacts: {
                        ...options,
                        displayName: (contacts.length > 1 ? `${contacts.length} kontak` : contacts[0].displayName) || null,
                        contacts,
                    },
                }, {
                    quoted,
                    ...options,
                    ephemeralExpiration: ephemeral
                })
            }
        },
        /**
         * Send Contact Array
         * @param {String} jid 
         * @param {String} number 
         * @param {String} name 
         * @param {Object} quoted 
         * @param {Object} options 
         */
        sendContactArray: {
            async value(jid, data, quoted, options) {
                if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
                let contacts = []
                for (let [number, name, isi, isi1, isi2, isi3, isi4, isi5] of data) {
                    number = number.replace(/[^0-9]/g, '')
                    let njid = number + '@s.whatsapp.net'
                    let biz = await mufar.getBusinessProfile(njid).catch(_ => null) || {}
                    // N:;${name.replace(/\n/g, '\\n').split(' ').reverse().join(';')};;;
                    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:${name.replace(/\n/g, '\\n')}
item.ORG:${isi}
item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:${isi1}
item2.EMAIL;type=INTERNET:${isi2}
item2.X-ABLabel:📧 Email
item3.ADR:;;${isi3};;;;
item3.X-ABADR:ac
item3.X-ABLabel:📍 Region
item4.URL:${isi4}
item4.X-ABLabel:Website
item5.X-ABLabel:${isi5}
END:VCARD`.trim()
                    contacts.push({
                        vcard,
                        displayName: name
                    })
                }
                return mufar.sendMessage(jid, {
                    contacts: {
                        displayName: (contacts.length > 1 ? `2013 kontak` : contacts[0].displayName) || null,
                        contacts,
                    }
                }, {
                    quoted,
                    ...options
                })
            }
        },
        /**
         * Send Media All Type 
         * @param {String} jid
         * @param {String|Buffer} path
         * @param {Object} quoted
         * @param {Object} options 
         */
        sendMedia: {
            async value(jid, path, quoted, options = {}) {
                let {
                    ext,
                    mime,
                    data
                } = await mufar.getFile(path)
                let messageType = mime.split("/")[0]
                let pase = messageType.replace('application', 'document') || messageType
                return mufar.sendMessage(jid, {
                    [`${pase}`]: data,
                    mimetype: mime,
                    ...options
                }, {
                    quoted
                })
            }
        },
        /**
         * Send a list message
         * @param jid the id to send to
         * @param button the optional button text, title and description button
         * @param rows the rows of sections list message
         */
        /*
        sendListM: {
        async value(jid, button, rows, quoted, options = {}) {
            const sections = [
                {
                    title: button.title,
                    rows: [...rows]
                }
            ]
            const listMessage = {
                text: button.description,
                footer: button.footerText,
                mentions: await mufar.parseMention(button.description),
                ephemeralExpiration: ephemeral,
                title: '',
                buttonText:button.buttonText,
                sections
            }
            mufar.sendMessage(jid, listMessage, {
                quoted,
                ephemeralExpiration: fsizedoc,
                contextInfo: {
                    forwardingScore: fsizedoc,
                    isForwarded: true,
                    mentions: await mufar.parseMention(button.description + button.footerText),
                    ...options
                }
            })
          }
        },
        */
        sendListM: {
            /**
             * Reply to a message
             * @param {String} jid
             * @param {String|Buffer} text
             * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
             * @param {Object} options
             */
            async value(jid, button, rows, quoted, options = {}) {
                let teks = rows
                    .map((v, index) => {
                        return `${v.title || ''}\n${v.rowId || ''}\n${v.description || ''}`.trim()
                    })
                    .filter(v => v)
                    .join("\n\n")
                return mufar.sendMessage(jid, {
                    ...options,
                    text: teks
                }, {
                    quoted,
                    ...options
                })
            }
        },
        /**
     * appenTextMessage
     * @param {String} text
     * @param {*} chatUpdate
     * @returns
     */
    appenTextMessage: {
      async value(m, text, chatUpdate) {
        let messages = await generateWAMessage(
          m.chat,
          { text: text, mentions: m.mentionedJid },
          {
            userJid: mufar.user.id,
            quoted: m.quoted && m.quoted.fakeObj,
          }
        );
        messages.key.fromMe = areJidsSameUser(m.sender, mufar.user.id);
        messages.key.id = m.key.id;
        messages.pushName = m.pushName;
        if (m.isGroup) messages.participant = m.sender;
        let msg = {
          ...chatUpdate,
          messages: [proto.WebMessageInfo.fromObject(messages)],
          type: "append",
        };
        mufar.ev.emit("messages.upsert", msg);
      },
    },
        /** Resize Image
         *
         * @param {Buffer} Buffer (Only Image)
         * @param {Numeric} Width
         * @param {Numeric} Height
         */
        resize: {
            async value(image, width, height) {
                let oyy = await Jimp.read(image)
                let kiyomasa = await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG)
                return kiyomasa
            }
        },
        /** Profile Image
         *
         * @param {Buffer} Buffer (Only Image)
         * @param {Numeric} Width
         * @param {Numeric} Height
         */
        generateProfilePicture: {
            async value(buffer) {
                const jimp_1 = await Jimp.read(buffer);
                const resz = jimp_1.getWidth() > jimp_1.getHeight() ? jimp_1.resize(550, Jimp.AUTO) : jimp_1.resize(Jimp.AUTO, 650)
                const jimp_2 = await Jimp.read(await resz.getBufferAsync(Jimp.MIME_JPEG));
                return {
                    img: await resz.getBufferAsync(Jimp.MIME_JPEG)
                }
            }
        },
        /**
         * Send Payment
         */
        sendPayment: {
            async value(jid, amount, currency, text = '', from, image, options) {
                let file = await mufar.resize(image, 300, 150)
                let a = ["IDR", "RSD", "USD"]
                let b = a[Math.floor(Math.random() * a.length)]
                const requestPaymentMessage = {
                    amount: {
                        currencyCode: currency || b,
                        offset: 0,
                        value: amount || 9.99
                    },
                    expiryTimestamp: 0,
                    amount1000: (amount || 9.99) * 1000,
                    currencyCodeIso4217: currency || b,
                    requestFrom: from || '0@s.whatsapp.net',
                    noteMessage: {
                        extendedTextMessage: {
                            text: text || 'Example Payment Message'
                        }
                    },
                    background: !!image ? file : undefined
                };
                return mufar.relayMessage(jid, {
                    requestPaymentMessage
                }, {
                    ...options
                });
            }
        },
        /**
         * Send React
         */
        sendReact: {
            async value(jid, Emoji = '', key) {
                return mufar.sendMessage(jid, {
                    react: {
                        text: Emoji,
                        key: key,
                    }
                })
            }
        },
        /**
         * Send Poll
         */
        sendPoll: {
            async value(jid, name = '', optiPoll, options) {
                if (!Array.isArray(optiPoll[0]) && typeof optiPoll[0] === 'string') optiPoll = [optiPoll]
                if (!options) options = {}
                const pollMessage = {
                    name: name,
                    options: optiPoll.map(btn => ({
                        optionName: !nullish(btn[0]) && btn[0] || ''
                    })),
                    selectableOptionsCount: 1
                }
                return mufar.relayMessage(jid, {
                    pollCreationMessage: pollMessage
                }, {
                    ...options
                });
            }
        },
        sendList: {
            /**
             * Reply to a message
             * @param {String} jid
             * @param {String|Buffer} text
             * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
             * @param {Object} options
             */
            async value(jid, header, footer, separate, buttons, rows, quoted, options = {}) {
                const inputArray = rows.flat()
                const result = inputArray.reduce((acc, curr, index) => {
                    if (index % 2 === 1) {
                        const [title, rowId, description] = curr[0]
                        acc.push({
                            title,
                            rowId,
                            description
                        })
                    }
                    return acc
                }, [])
                let teks = result
                    .map((v, index) => {
                        return `${v.title || ''}\n${v.rowId || ''}\n${v.description || ''}`.trim()
                    })
                    .filter(v => v)
                    .join("\n\n")
                return mufar.sendMessage(jid, {
                    ...options,
                    text: teks
                }, {
                    quoted,
                    ...options
                })
            }
        },
        /**
         * By Fokus ID
         * @param {*} message 
         * @param {*} filename 
         * @param {*} attachExtension 
         * @returns 
         */
        downloadAndSaveMediaMessage: {
            async value(message, filename, attachExtension = true) {
                let quoted = message.msg ? message.msg : message
                let mime = (message.msg || message).mimetype || ''
                let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
                const stream = await downloadContentFromMessage(quoted, messageType)
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                let trueFileName;
                let type = await fileTypeFromBuffer(buffer)
                trueFileName = attachExtension ? (filename + '.' + 'bin') : filename
                // save to file
                await fs.writeFileSync(trueFileName, buffer)
                return trueFileName
            }
        },
        /**
         * Picture  
         */
        updateProfilePicture: {
            async value(jid, buffer) {
                let img
                try {
                    img = await generateProfilePicture(buffer)
                } catch {
                    img = await mufar.generateProfilePicture(buffer)
                }
                await mufar.query({
                    tag: 'iq',
                    attrs: {
                        to: jid,
                        type: 'set',
                        xmlns: 'w:profile:picture'
                    },
                    content: [{
                        tag: 'picture',
                        attrs: {
                            type: 'image'
                        },
                        content: img
                    }]
                })
            }
        },
        /**
         *status 
         */
        updateProfileStatus: {
            async value(status) {
                return mufar.query({
                    tag: 'iq',
                    attrs: {
                        to: 's.whatsapp.net',
                        type: 'set',
                        xmlns: 'status',
                    },
                    content: [{
                        tag: 'status',
                        attrs: {},
                        content: Buffer.from(status, 'utf-8')
                    }]
                })
            }
        },
        /**
         * Translate Text 
         * @param {String} code
         * @param {String|Buffer} text
         */
        translate: {
            async value(code, text) {
                return translate(text, {
                    from: 'id',
                    to: code
                })
            }
        },
        /**
         * 
         * @param {String} text 
         * @returns 
         */
        filter: {
            value(text = '') {
                let mati = ["q", "w", "r", "t", "y", "p", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]
                if (/[aiueo][aiueo]([qwrtypsdfghjklzxcvbnm])?$/i.test(text)) return text.substring(text.length - 1)
                else {
                    let res = Array.from(text).filter(v => mati.includes(v))
                    let resu = res[res.length - 1]
                    for (let huruf of mati) {
                        if (text.endsWith(huruf)) {
                            resu = res[res.length - 2]
                        }
                    }
                    let misah = text.split(resu)
                    return resu + misah[misah.length - 1]
                }
            }
        },        
         
              
        /** This Section **/
              reply: {
            /**
             * Reply to a message
             * @param {String} jid
             * @param {String|Buffer} text
             * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
             * @param {Object} options
             */
            value(jid, text = '', quoted, options) {
                let pp = mufar.profilePictureUrl(mufar.user.jid, 'image')
                const _uptime = process.uptime() * 1000
                return Buffer.isBuffer(text) ? mufar.sendFile(jid, text, 'file', '', quoted, false, options) : mufar.sendMessage(jid, { ...options,
                text,
                mentions: mufar.parseMention(text),
                //contextInfo: global.ppkecil.contextInfo,
                mentions: mufar.parseMention(text),
                ...options }, {
                    quoted,
                    ephemeralExpiration: 86400,
                    ...options
                })
            }
        },                
        cMod: {
            /**
             * cMod
             * @param {String} jid 
             * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} message 
             * @param {String} text 
             * @param {String} sender 
             * @param {*} options 
             * @returns 
             */
            value(jid, message, text = '', sender = mufar.user.jid, options = {}) {
                if (options.mentions && !Array.isArray(options.mentions)) options.mentions = [options.mentions]
                let copy = message.toJSON()
                delete copy.message.messageContextInfo
                delete copy.message.senderKeyDistributionMessage
                let mtype = Object.keys(copy.message)[0]
                let msg = copy.message
                let content = msg[mtype]
                if (typeof content === 'string') msg[mtype] = text || content
                else if (content.caption) content.caption = text || content.caption
                else if (content.text) content.text = text || content.text
                if (typeof content !== 'string') {
                    msg[mtype] = {
                        ...content,
                        ...options
                    }
                    msg[mtype].contextInfo = {
                        ...(content.contextInfo || {}),
                        mentionedJid: options.mentions || content.contextInfo?.mentionedJid || []
                    }
                }
                if (copy.participant) sender = copy.participant = sender || copy.participant
                else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
                if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
                else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
                copy.key.remoteJid = jid
                copy.key.fromMe = areJidsSameUser(sender, mufar.user.id) || false
                return proto.WebMessageInfo.fromObject(copy)
            },
            enumerable: true
        },
        copyNForward: {
            /**
             * Exact Copy Forward
             * @param {String} jid
             * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} message
             * @param {Boolean|Number} forwardingScore
             * @param {Object} options
             */
            async value(jid, message, forwardingScore = true, options = {}) {
                let vtype
                if (options.readViewOnce && message.message.viewOnceMessage?.message) {
                    vtype = Object.keys(message.message.viewOnceMessage.message)[0]
                    delete message.message.viewOnceMessage.message[vtype].viewOnce
                    message.message = proto.Message.fromObject(
                        JSON.parse(JSON.stringify(message.message.viewOnceMessage.message))
                    )
                    message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo
                }
                let mtype = Object.keys(message.message)[0]
                let m = generateForwardMessageContent(message, !!forwardingScore)
                let ctype = Object.keys(m)[0]
                if (forwardingScore && typeof forwardingScore === 'number' && forwardingScore > 1) m[ctype].contextInfo.forwardingScore += forwardingScore
                m[ctype].contextInfo = {
                    ...(message.message[mtype].contextInfo || {}),
                    ...(m[ctype].contextInfo || {})
                }
                m = generateWAMessageFromContent(jid, m, {
                    ...options,
                    userJid: mufar.user.jid
                })
                await mufar.relayMessage(jid, m.message, {
                    messageId: m.key.id,
                    additionalAttributes: {
                        ...options
                    }
                })
                return m
            },
            enumerable: true
        },
        fakeReply: {
            /**
             * Fake Replies
             * @param {String} jid
             * @param {String|Object} text
             * @param {String} fakeJid
             * @param {String} fakeText
             * @param {String} fakeGroupJid
             * @param {String} options
             */
            value(jid, text = '', fakeJid = this.user.jid, fakeText = '', fakeGroupJid, options) {
                return mufar.reply(jid, text, {
                    key: {
                        fromMe: areJidsSameUser(fakeJid, mufar.user.id),
                        participant: fakeJid,
                        ...(fakeGroupJid ? {
                            remoteJid: fakeGroupJid
                        } : {})
                    },
                    message: {
                        conversation: fakeText
                    },
                    ...options
                })
            }
        },
        downloadM: {
            /**
             * Download media message
             * @param {Object} m
             * @param {String} type
             * @param {fs.PathLike | fs.promises.FileHandle} saveToFile
             * @returns {Promise<fs.PathLike | fs.promises.FileHandle | Buffer>}
             */
            async value(m, type, saveToFile) {
                let filename
                if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
                const stream = await downloadContentFromMessage(m, type)
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                if (saveToFile)({
                    filename
                } = await mufar.getFile(buffer, true))
                return saveToFile && fs.existsSync(filename) ? filename : buffer
            },
            enumerable: true
        },
         parseMention: {
  /**
   * Parses string into mentionedJid(s)
   * @param {String} text
   * @returns {Array<String>}
   */
  value(text = '') {
    // Polyfill for matchAll
    if (!String.prototype.matchAll) {
      String.prototype.matchAll = function(regexp) {
        const matches = [];
        this.replace(regexp, (match, ...args) => {
          const matchArray = [match, ...args.slice(0, -2), args.slice(-2)];
          matchArray.index = args[args.length - 1];
          matches.push(matchArray);
        });
        return matches.length === 0 ? { [Symbol.iterator]: function() { return this; } } : matches[0];
      };
    }

    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
  },
  enumerable: true
},
        getName: {
            /**
             * Get name from jid
             * @param {String} jid
             * @param {Boolean} withoutContact
             */
            value(jid = '', withoutContact = false) {
                jid = mufar.decodeJid(jid)
                withoutContact = mufar.withoutContact || withoutContact
                let v
                if (jid.endsWith('@g.us')) return new Promise(async (resolve) => {
                    v = mufar.chats[jid] || {}
                    if (!(v.name || v.subject)) v = await mufar.groupMetadata(jid) || {}
                    resolve(v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'))
                })
                else v = jid === '0@s.whatsapp.net' ? {
                        jid,
                        vname: 'WhatsApp'
                    } : areJidsSameUser(jid, mufar.user.id) ?
                    mufar.user :
                    (mufar.chats[jid] || {})
                return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
            },
            enumerable: true
        },
        loadMessage: {
            /**
             * 
             * @param {String} messageID 
             * @returns {import('@whiskeysockets/baileys').proto.WebMessageInfo}
             */
            value(messageID) {
                return Object.entries(mufar.chats)
                    .filter(([_, {
                        messages
                    }]) => typeof messages === 'object')
                    .find(([_, {
                            messages
                        }]) => Object.entries(messages)
                        .find(([k, v]) => (k === messageID || v.key?.id === messageID)))
                    ?.[1].messages?.[messageID]
            },
            enumerable: true
        },
        sendGroupV4Invite: {
            /**
             * sendGroupV4Invite
             * @param {String} jid 
             * @param {*} participant 
             * @param {String} inviteCode 
             * @param {Number} inviteExpiration 
             * @param {String} groupName 
             * @param {String} caption 
             * @param {Buffer} jpegThumbnail
             * @param {*} options 
             */
            async value(jid, participant, inviteCode, inviteExpiration, groupName = 'unknown subject', caption = 'Invitation to join my WhatsApp group', jpegThumbnail, options = {}) {
                const msg = proto.Message.fromObject({
                    groupInviteMessage: proto.GroupInviteMessage.fromObject({
                        inviteCode,
                        inviteExpiration: parseInt(inviteExpiration) || +new Date(new Date + (3 * 86400000)),
                        groupJid: jid,
                        groupName: (groupName ? groupName : await mufar.getName(jid)) || null,
                        jpegThumbnail: Buffer.isBuffer(jpegThumbnail) ? jpegThumbnail : null,
                        caption
                    })
                })
                const message = generateWAMessageFromContent(participant, msg, options)
                await mufar.relayMessage(participant, message.message, {
                    messageId: message.key.id,
                    additionalAttributes: {
                        ...options
                    }
                })
                return message
            },
            enumerable: true
        },
        processMessageStubType: {
            /**
             * to process MessageStubType
             * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} m 
             */
            async value(m) {
                if (!m.messageStubType) return
                const chat = mufar.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || '')
                if (!chat || chat === 'status@broadcast') return
                const emitGroupUpdate = (update) => {
                    ev.emit('groups.update', [{
                        id: chat,
                        ...update
                    }])
                }
                switch (m.messageStubType) {
                    case WAMessageStubType.REVOKE:
                    case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
                        emitGroupUpdate({
                            revoke: m.messageStubParameters[0]
                        })
                        break
                    case WAMessageStubType.GROUP_CHANGE_ICON:
                        emitGroupUpdate({
                            icon: m.messageStubParameters[0]
                        })
                        break
                    default: {
                        console.log({
                            messageStubType: m.messageStubType,
                            messageStubParameters: m.messageStubParameters,
                            type: WAMessageStubType[m.messageStubType]
                        })
                        break
                    }
                }
                const isGroup = chat.endsWith('@g.us')
                if (!isGroup) return
                let chats = mufar.chats[chat]
                if (!chats) chats = mufar.chats[chat] = {
                    id: chat
                }
                chats.isChats = true
                const metadata = await mufar.groupMetadata(chat).catch(_ => null)
                if (!metadata) return
                chats.subject = metadata.subject
                chats.metadata = metadata
            }
        },
        insertAllGroup: {
            async value() {
                const groups = await mufar.groupFetchAllParticipating().catch(_ => null) || {}
                for (const group in groups) mufar.chats[group] = {
                    ...(mufar.chats[group] || {}),
                    id: group,
                    subject: groups[group].subject,
                    isChats: true,
                    metadata: groups[group]
                }
                return mufar.chats
            },
        },
        sendStimg: {
            async value(jid, path, quoted, options = {}) {
                let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
                let buffer
                if (options && (options.packname || options.author)) {
                    buffer = await writeExifImg(buff, options)
                } else {
                    buffer = await imageToWebp(buff)
                }
                await mufar.sendMessage(jid, {
                    sticker: {
                        url: buffer
                    },
                    ...options
                }, {
                    quoted
                })
                return buffer
            }
        },
        sendStvid: {
            async value(jid, path, quoted, options = {}) {
                let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
                let buffer
                if (options && (options.packname || options.author)) {
                    buffer = await writeExifVid(buff, options)
                } else {
                    buffer = await videoToWebp(buff)
                }
                await mufar.sendMessage(jid, {
                    sticker: {
                        url: buffer
                    },
                    ...options
                }, {
                    quoted
                })
                return buffer
            }
        },
        pushMessage: {
            /**
             * pushMessage
             * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo[]} m 
             */
            async value(m) {
                if (!m) return
                if (!Array.isArray(m)) m = [m]
                for (const message of m) {
                    try {
                        // if (!(message instanceof proto.WebMessageInfo)) continue // https://github.com/adiwajshing/Baileys/pull/696/commits/6a2cb5a4139d8eb0a75c4c4ea7ed52adc0aec20f
                        if (!message) continue
                        if (message.messageStubType && message.messageStubType != WAMessageStubType.CIPHERTEXT) mufar.processMessageStubType(message).catch(console.error)
                        const _mtype = Object.keys(message.message || {})
                        const mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(_mtype[0]) && _mtype[0]) ||
                            (_mtype.length >= 3 && _mtype[1] !== 'messageContextInfo' && _mtype[1]) ||
                            _mtype[_mtype.length - 1]
                        const chat = mufar.decodeJid(message.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
                        if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
                            /**
                             * @type {import('@whiskeysockets/baileys').proto.IContextInfo}
                             */
                            let context = message.message[mtype].contextInfo
                            let participant = mufar.decodeJid(context.participant)
                            const remoteJid = mufar.decodeJid(context.remoteJid || participant)
                            /**
                             * @type {import('@whiskeysockets/baileys').proto.IMessage}
                             * 
                             */
                            let quoted = message.message[mtype].contextInfo.quotedMessage
                            if ((remoteJid && remoteJid !== 'status@broadcast') && quoted) {
                                let qMtype = Object.keys(quoted)[0]
                                if (qMtype == 'conversation') {
                                    quoted.extendedTextMessage = {
                                        text: quoted[qMtype]
                                    }
                                    delete quoted.conversation
                                    qMtype = 'extendedTextMessage'
                                }
                                if (!quoted[qMtype].contextInfo) quoted[qMtype].contextInfo = {}
                                quoted[qMtype].contextInfo.mentionedJid = context.mentionedJid || quoted[qMtype].contextInfo.mentionedJid || []
                                const isGroup = remoteJid.endsWith('g.us')
                                if (isGroup && !participant) participant = remoteJid
                                const qM = {
                                    key: {
                                        remoteJid,
                                        fromMe: areJidsSameUser(mufar.user.jid, remoteJid),
                                        id: context.stanzaId,
                                        participant,
                                    },
                                    message: JSON.parse(JSON.stringify(quoted)),
                                    ...(isGroup ? {
                                        participant
                                    } : {})
                                }
                                let qChats = mufar.chats[participant]
                                if (!qChats) qChats = mufar.chats[participant] = {
                                    id: participant,
                                    isChats: !isGroup
                                }
                                if (!qChats.messages) qChats.messages = {}
                                if (!qChats.messages[context.stanzaId] && !qM.key.fromMe) qChats.messages[context.stanzaId] = qM
                                let qChatsMessages
                                if ((qChatsMessages = Object.entries(qChats.messages)).length > 40) qChats.messages = Object.fromEntries(qChatsMessages.slice(30, qChatsMessages.length)) // maybe avoid memory leak
                            }
                        }
                        if (!chat || chat === 'status@broadcast') continue
                        const isGroup = chat.endsWith('@g.us')
                        let chats = mufar.chats[chat]
                        if (!chats) {
                            if (isGroup) await mufar.insertAllGroup().catch(console.error)
                            chats = mufar.chats[chat] = {
                                id: chat,
                                isChats: true,
                                ...(mufar.chats[chat] || {})
                            }
                        }
                        let metadata, sender
                        if (isGroup) {
                            if (!chats.subject || !chats.metadata) {
                                metadata = await mufar.groupMetadata(chat).catch(_ => ({})) || {}
                                if (!chats.subject) chats.subject = metadata.subject || ''
                                if (!chats.metadata) chats.metadata = metadata
                            }
                            sender = mufar.decodeJid(message.key?.fromMe && mufar.user.id || message.participant || message.key?.participant || chat || '')
                            if (sender !== chat) {
                                let chats = mufar.chats[sender]
                                if (!chats) chats = mufar.chats[sender] = {
                                    id: sender
                                }
                                if (!chats.name) chats.name = message.pushName || chats.name || ''
                            }
                        } else if (!chats.name) chats.name = message.pushName || chats.name || ''
                        if (['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype)) continue
                        chats.isChats = true
                        if (!chats.messages) chats.messages = {}
                        const fromMe = message.key.fromMe || areJidsSameUser(sender || chat, mufar.user.id)
                        if (!['protocolMessage'].includes(mtype) && !fromMe && message.messageStubType != WAMessageStubType.CIPHERTEXT && message.message) {
                            delete message.message.messageContextInfo
                            delete message.message.senderKeyDistributionMessage
                            chats.messages[message.key.id] = JSON.parse(JSON.stringify(message, null, 2))
                            let chatsMessages
                            if ((chatsMessages = Object.entries(chats.messages)).length > 40) chats.messages = Object.fromEntries(chatsMessages.slice(30, chatsMessages.length))
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        },
        serializeM: {
            /**
             * Serialize Message, so it easier to manipulate
             * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} m
             */
            value(m) {
                return smsg(mufar, m)
            }
        },
        ...(typeof mufar.chatRead !== 'function' ? {
            chatRead: {
                /**
                 * Read message
                 * @param {String} jid 
                 * @param {String|undefined|null} participant 
                 * @param {String} messageID 
                 */
                value(messageKey) {
                    return mufar.readMessages([messageKey])
                },
                enumerable: true
            }
        } : {}),
        ...(typeof mufar.setStatus !== 'function' ? {
            setStatus: {
                /**
                 * setStatus bot
                 * @param {String} status 
                 */
                value(status) {
                    return mufar.query({
                        tag: 'iq',
                        attrs: {
                            to: S_WHATSAPP_NET,
                            type: 'set',
                            xmlns: 'status',
                        },
                        content: [{
                            tag: 'status',
                            attrs: {},
                            content: Buffer.from(status, 'utf-8')
                        }]
                    })
                },
                enumerable: true
            }
        } : {})
    })
    if (sock.user?.id) sock.user.jid = sock.decodeJid(sock.user.id)
    store.bind(sock)
    return sock
}
/**
 * Serialize Message
 * @param {ReturnType<typeof makeWASocket>} conn 
 * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} m 
 * @param {Boolean} hasParent 
 */
export function smsg(mufar, m, hasParent) {
    if (!m) return m
    /**
     * @type {import('@whiskeysockets/baileys').proto.WebMessageInfo}
     */
    let M = proto.WebMessageInfo
    m = M.fromObject(m)
    m.mufar = mufar
    let protocolMessageKey
    if (m.message) {
        if (m.mtype == 'protocolMessage' && m.msg.key) {
            protocolMessageKey = m.msg.key
            if (protocolMessageKey == 'status@broadcast') protocolMessageKey.remoteJid = m.chat
            if (!protocolMessageKey.participant || protocolMessageKey.participant == 'status_me') protocolMessageKey.participant = m.sender
            protocolMessageKey.fromMe = mufar.decodeJid(protocolMessageKey.participant) === mufar.decodeJid(mufar.user.id)
            if (!protocolMessageKey.fromMe && protocolMessageKey.remoteJid === mufar.decodeJid(mufar.user.id)) protocolMessageKey.remoteJid = m.sender
        }
        if (m.quoted)
            if (!m.quoted.mediaMessage) delete m.quoted.download
    }
    if (!m.mediaMessage) delete m.download

    try {
        if (protocolMessageKey && m.mtype == 'protocolMessage') mufar.ev.emit('message.delete', protocolMessageKey)
    } catch (e) {
        console.error(e)
    }
    return m
}

// https://github.com/Nurutomo/wabot-aq/issues/490
export function serialize() {
    const MediaType = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage']
    return Object.defineProperties(proto.WebMessageInfo.prototype, {
        mufar: {
            value: undefined,
            enumerable: false,
            writable: true
        },
        id: {
            get() {
                return this.key?.id
            }
        },
        isBaileys: {
            get() {
                return this.id?.length === 16 || this.id?.startsWith('3EB0') && this.id?.length === 12 || false
            }
        },
        chat: {
            get() {
                const senderKeyDistributionMessage = this.message?.senderKeyDistributionMessage?.groupId
                return (
                    this.key?.remoteJid ||
                    (senderKeyDistributionMessage &&
                        senderKeyDistributionMessage !== 'status@broadcast'
                    ) || ''
                ).decodeJid()
            }
        },
        isGroup: {
            get() {
                return this.chat.endsWith('@g.us')
            },
            enumerable: true
        },
        sender: {
            get() {
                return this.mufar?.decodeJid(this.key?.fromMe && this.mufar?.user.id || this.participant || this.key.participant || this.chat || '')
            },
            enumerable: true
        },
        fromMe: {
            get() {
                return this.key?.fromMe || areJidsSameUser(this.mufar?.user.id, this.sender) || false
            }
        },
        mtype: {
            get() {
                if (!this.message) return ''
                const type = Object.keys(this.message)
                return (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(type[0]) && type[0]) || // Sometimes message in the front
                    (type.length >= 3 && type[1] !== 'messageContextInfo' && type[1]) || // Sometimes message in midle if mtype length is greater than or equal to 3
                    type[type.length - 1] // common case
            },
            enumerable: true
        },
        msg: {
            get() {
                if (!this.message) return null
                return this.message[this.mtype]
            }
        },
        mediaMessage: {
            get() {
                if (!this.message) return null
                const Message = ((this.msg?.url || this.msg?.directPath) ? { ...this.message } : extractMessageContent(this.message)) || null
                if (!Message) return null
                const mtype = Object.keys(Message)[0]
                return MediaType.includes(mtype) ? Message : null
            },
            enumerable: true
        },
        mediaType: {
            get() {
                let message
                if (!(message = this.mediaMessage)) return null
                return Object.keys(message)[0]
            },
            enumerable: true,
        },
        quoted: {
            get() {
                /**
                 * @type {ReturnType<typeof makeWASocket>}
                 */
                const self = this
                const msg = self.msg
                const contextInfo = msg?.contextInfo
                const quoted = contextInfo?.quotedMessage
                if (!msg || !contextInfo || !quoted) return null
                const type = Object.keys(quoted)[0]
                let q = quoted[type]
                const text = typeof q === 'string' ? q : q.text
                return Object.defineProperties(JSON.parse(JSON.stringify(typeof q === 'string' ? { text: q } : q)), {
                    mtype: {
                        get() {
                            return type
                        },
                        enumerable: true
                    },
                    mediaMessage: {
                        get() {
                            const Message = ((q.url || q.directPath) ? { ...quoted } : extractMessageContent(quoted)) || null
                            if (!Message) return null
                            const mtype = Object.keys(Message)[0]
                            return MediaType.includes(mtype) ? Message : null
                        },
                        enumerable: true
                    },
                    mediaType: {
                        get() {
                            let message
                            if (!(message = this.mediaMessage)) return null
                            return Object.keys(message)[0]
                        },
                        enumerable: true,
                    },
                    id: {
                        get() {
                            return contextInfo.stanzaId
                        },
                        enumerable: true
                    },
                    chat: {
                        get() {
                            return contextInfo.remoteJid || self.chat
                        },
                        enumerable: true
                    },
                    isBaileys: {
                        get() {
                            return this.id?.length === 16 || this.id?.startsWith('3EB0') && this.id.length === 12 || false
                        },
                        enumerable: true
                    },
                    sender: {
                        get() {
                            return (contextInfo.participant || this.chat || '').decodeJid()
                        },
                        enumerable: true
                    },
                    fromMe: {
                        get() {
                            return areJidsSameUser(this.sender, self.mufar?.user.jid)
                        },
                        enumerable: true,
                    },
                    text: {
                        get() {
                            return text || this.caption || this.contentText || this.selectedDisplayText || ''
                        },
                        enumerable: true
                    },
                    mentionedJid: {
                        get() {
                            return q.contextInfo?.mentionedJid || self.getQuotedObj()?.mentionedJid || []
                        },
                        enumerable: true
                    },
                    name: {
                        get() {
                            const sender = this.sender
                            return sender ? self.mufar?.getName(sender) : null
                        },
                        enumerable: true

                    },
                    vM: {
                        get() {
                            return proto.WebMessageInfo.fromObject({
                                key: {
                                    fromMe: this.fromMe,
                                    remoteJid: this.chat,
                                    id: this.id
                                },
                                message: quoted,
                                ...(self.isGroup ? { participant: this.sender } : {})
                            })
                        }
                    },
                    fakeObj: {
                        get() {
                            return this.vM
                        }
                    },
                    download: {
                        value(saveToFile = false) {
                            const mtype = this.mediaType
                            return self.mufar?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), saveToFile)
                        },
                        enumerable: true,
                        configurable: true,
                    },
                    reply: {
                        /**
                         * Reply to quoted message
                         * @param {String|Object} text
                         * @param {String|false} chatId
                         * @param {Object} options
                         */
                        value(text, chatId, options) {
                            return self.mufar?.reply(chatId ? chatId : this.chat, text, this.vM, options)
                        },
                        enumerable: true,
                    },
                    copy: {
                        /**
                         * Copy quoted message
                         */
                        value() {
                            const M = proto.WebMessageInfo
                            return smsg(mufar, M.fromObject(M.toObject(this.vM)))
                        },
                        enumerable: true,
                    },
                    forward: {
                        /**
                         * Forward quoted message
                         * @param {String} jid
                         *  @param {Boolean} forceForward
                         */
                        value(jid, force = false, options) {
                            return self.mufar?.sendMessage(jid, {
                                forward: this.vM, force, ...options
                            }, { ...options })
                        },
                        enumerable: true,
                    },
                    copyNForward: {
                        /**
                         * Exact Forward quoted message
                         * @param {String} jid
                         * @param {Boolean|Number} forceForward
                         * @param {Object} options
                         */
                        value(jid, forceForward = false, options) {
                            return self.mufar?.copyNForward(jid, this.vM, forceForward, options)
                        },
                        enumerable: true,

                    },
                    cMod: {
                        /**
                         * Modify quoted Message
                         * @param {String} jid
                         * @param {String} text
                         * @param {String} sender
                         * @param {Object} options
                         */
                        value(jid, text = '', sender = this.sender, options = {}) {
                            return self.mufar?.cMod(jid, this.vM, text, sender, options)
                        },
                        enumerable: true,
                        
                    },
                    delete: {
    /**
     * Delete message using a specified key
     * @param {string} key - The key associated with the message to be deleted
     */
    value(key) {
        return self.mufar?.sendMessage(this.chat, { delete: key });
    },
    enumerable: true,
},

                    //react
                      react: {
                        value(text) {
                            return self.mufar?.sendMessage(this.chat, {
                                react: {
                                    text,
                                    key: this.vM.key
                                }
                            })
                        },
                        enumerable: true,
                    }
                    //
                })
            },
            enumerable: true
        },
        _text: {
            value: null,
            writable: true,
        },
        text: {
            get() {
                const msg = this.msg
                const text = (typeof msg === 'string' ? msg : msg?.text) || msg?.caption || msg?.contentText || ''
                return typeof this._text === 'string' ? this._text : '' || (typeof text === 'string' ? text : (
                    text?.selectedDisplayText ||
                    text?.hydratedTemplate?.hydratedContentText ||
                    text
                )) || ''
            },
            set(str) {
                return this._text = str
            },
            enumerable: true
        },
        mentionedJid: {
            get() {
                return this.msg?.contextInfo?.mentionedJid?.length && this.msg.contextInfo.mentionedJid || []
            },
            enumerable: true
        },
        name: {
            get() {
                return !nullish(this.pushName) && this.pushName || this.mufar?.getName(this.sender)
            },
            enumerable: true
        },
        download: {
            value(saveToFile = false) {
                const mtype = this.mediaType
                return this.mufar?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), saveToFile)
            },
            enumerable: true,
            configurable: true
        },
        reply: {
            value(text, chatId, options) {
                return this.mufar?.reply(chatId ? chatId : this.chat, text, this, options)
            }
        },
        copy: {
            value() {
                const M = proto.WebMessageInfo
                return smsg(this.mufar, M.fromObject(M.toObject(this)))
            },
            enumerable: true
        },
        forward: {
            value(jid, force = false, options = {}) {
                return this.mufar?.sendMessage(jid, {
                    forward: this, force, ...options
                }, { ...options })
            },
            enumerable: true
        },
        copyNForward: {
            value(jid, forceForward = false, options = {}) {
                return this.mufar?.copyNForward(jid, this, forceForward, options)
            },
            enumerable: true
        },
        cMod: {
            value(jid, text = '', sender = this.sender, options = {}) {
                return this.mufar?.cMod(jid, this, text, sender, options)
            },
            enumerable: true
        },
        getQuotedObj: {
            value() {
                if (!this.quoted.id) return null
                const q = proto.WebMessageInfo.fromObject(this.mufar?.loadMessage(this.quoted.id) || this.quoted.vM)
                return smsg(this.mufar, q)
            },
            enumerable: true
        },
        getQuotedMessage: {
            get() {
                return this.getQuotedObj
            }
        },
        delete: {
            value() {
                return this.mufar?.sendMessage(this.chat, { delete: this.key })
            },
            enumerable: true
        }, 
        //react 
          react: {
            value(text) {
                return this.mufar?.sendMessage(this.chat, {
                    react: {
                        text,
                        key: this.key
                    }
                })
            },
            enumerable: true
        }
        //
    })
}
export function logic(check, inp, out) {
    if (inp.length !== out.length) throw new Error('Input and Output must have same length')
    for (let i in inp)
        if (util.isDeepStrictEqual(check, inp[i])) return out[i]
    return null
}

export function protoType() {
    Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
        const ab = new ArrayBuffer(this.length);
        const view = new Uint8Array(ab);
        for (let i = 0; i < this.length; ++i) {
            view[i] = this[i];
        }
        return ab;
    }
    /**
     * @returns {ArrayBuffer}
     */
    Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
        return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength)
    }
    /**
     * @returns {Buffer}
     */
    ArrayBuffer.prototype.toBuffer = function toBuffer() {
        return Buffer.from(new Uint8Array(this))
    }
    // /**
    //  * @returns {String}
    //  */
    // Buffer.prototype.toUtilFormat = ArrayBuffer.prototype.toUtilFormat = Object.prototype.toUtilFormat = Array.prototype.toUtilFormat = function toUtilFormat() {
    //     return util.format(this)
    // }
    Uint8Array.prototype.getFileType = ArrayBuffer.prototype.getFileType = Buffer.prototype.getFileType = async function getFileType() {
        return await fileTypeFromBuffer(this)
    }
    /**
     * @returns {Boolean}
     */
    String.prototype.isNumber = Number.prototype.isNumber = isNumber
    /**
     * 
     * @returns {String}
     */
    String.prototype.capitalize = function capitalize() {
        return this.charAt(0).toUpperCase() + this.slice(1, this.length)
    }
    /**
     * @returns {String}
     */
    String.prototype.capitalizeV2 = function capitalizeV2() {
        const str = this.split(' ')
        return str.map(v => v.capitalize()).join(' ')
    }
    String.prototype.decodeJid = function decodeJid() {
        if (/:\d+@/gi.test(this)) {
            const decode = jidDecode(this) || {}
            return (decode.user && decode.server && decode.user + '@' + decode.server || this).trim()
        } else return this.trim()
    }
    /**
     * number must be milliseconds
     * @returns {string}
     */
    Number.prototype.toTimeString = function toTimeString() {
        // const milliseconds = this % 1000
        const seconds = Math.floor((this / 1000) % 60)
        const minutes = Math.floor((this / (60 * 1000)) % 60)
        const hours = Math.floor((this / (60 * 60 * 1000)) % 24)
        const days = Math.floor((this / (24 * 60 * 60 * 1000)))
        return (
            (days ? `${days} Days ☀ ️` : '') +
            (hours ? `${hours} Hours 🕐 ` : '') +
            (minutes ? `${minutes} Minute ⏰ ` : '') +
            (seconds ? `${seconds} Second ⏱️ ` : '')
        ).trim()
    }
    Number.prototype.getRandom = String.prototype.getRandom = Array.prototype.getRandom = getRandom
}


function isNumber() {
    const int = parseInt(this)
    return typeof int === 'number' && !isNaN(int)
}

function getRandom() {
    if (Array.isArray(this) || this instanceof String) return this[Math.floor(Math.random() * this.length)]
    return Math.floor(Math.random() * this)
}


/**
 * ??
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
 * @returns {boolean}
 */
function nullish(args) {
    return !(args !== null && args !== undefined)
}

async function generateProfilePicture(mediaUpload) {
    let bufferOrFilePath
    if (Buffer.isBuffer(mediaUpload)) bufferOrFilePath = mediaUpload
    else if ('url' in mediaUpload) bufferOrFilePath = mediaUpload.url.toString()
    else bufferOrFilePath = await Baileys.toBuffer(mediaUpload.stream)
    const {
        read,
        MIME_JPEG,
        AUTO
    } = await Promise.resolve().then(async () => (await import('jimp')).default)
    const jimp = await read(bufferOrFilePath)
    const min = jimp.getWidth()
    const max = jimp.getHeight()
    const cropped = jimp.crop(0, 0, min, max)
    return {
        img: await cropped.quality(100).scaleToFit(720, 720, AUTO).getBufferAsync(MIME_JPEG)
    }
}

// TypeError: Cannot read properties of null (reading 'user')
//     at WebMessageInfo.get (file:///home/container/lib/simple.js:888:70)
//     at Object.value (file:///home/container/lib/simple.js:731:61)
//     at Object.handler (file:///home/container/handler.js?update=1646537086773:18:10)
//     at EventEmitter.emit (node:events:532:35)
//     at Object.all (file:///home/container/plugins/_templateResponse.js?update=1646538543307:79:13)
//     at async Object.handler (file:///home/container/handler.js?update=1646537086773:346:21)
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)