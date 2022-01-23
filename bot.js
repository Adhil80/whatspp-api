const { readFileSync } = require('fs');
const { InputFile } = require('grammy');
let puppeteer = require('puppeteer')
let { sleep } = require('./common-functions')
let { sendPhoto } = require('./telegram-bo')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let whatsapp = null
let defalutChat = null
let loadedDetails = false
let messageBox = null

let app = async () => {
    const browser = await puppeteer.launch({headless:false})
    whatsapp = await browser.newPage()
    await whatsapp.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3641.0 Safari/537.36');
    await whatsapp.goto('https://web.whatsapp.com/', { waitUntil: 'networkidle2' })
    await whatsapp.waitForSelector('canvas[aria-label="Scan me!"][role="img"]')
    await whatsapp.screenshot({ path: 'qrcode.png' })
    let qrImage = new InputFile('qrcode.png')
    sendPhoto(qrImage);
    await whatsapp.waitForSelector('div[role="textbox"][class="_13NKt copyable-text selectable-text"][contenteditable="true"]', { timeout: 1000 * 60*10 })
    await refreshDefaultChat()
    messageBox = await whatsapp.waitForSelector('div[title="Type a message"][role="textbox"]')
    console.log('logged in successfully!');
    await sleep(1000)
    loadedDetails = true
}
app()

module.exports = {
    sendMessage: (chatLink, message) => {
        return new Promise(async (resolve, reject) => {
            chatLink = 'wa.me/' + chatLink + '\n'
            if (loadedDetails) {
                await messageBox.type(chatLink)
                await sleep(500)
                chatLink = chatLink.replace('\n', '')
                chatLink = await whatsapp.waitForSelector('a[href="http://' + chatLink + '"]')
                await sleep(500)
                await chatLink.click()
                await sleep(4000)
                await messageBox.type(message + '\n')
                await sleep(500)
                await refreshDefaultChat()
                await sleep(500)
                resolve()
            }
        })
    }
}

let refreshDefaultChat = async () => {
    let textBox = await whatsapp.$('div[role="textbox"][class="_13NKt copyable-text selectable-text"][contenteditable="true"]')
    await sleep(500)
    await textBox.click()
    await sleep(500)
    await textBox.type('List')
    await sleep(500)
    defalutChat = await whatsapp.waitForSelector('span[class="matched-text i0jNr"]')
    await sleep(500)
    await defalutChat.click()
    await sleep(500)
}