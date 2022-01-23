const { Bot } = require("grammy");
require('dotenv').config()
const bot = new Bot(process.env.BOT_TOKEN); 
let myId = '890115605'
bot.start()

module.exports={
    sendMessage:(text)=>{
        bot.api.sendMessage(myId,text)
    },
    sendPhoto:(photo)=>{
        bot.api.sendPhoto(myId,photo)
    }
}