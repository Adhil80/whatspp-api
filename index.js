//const { sendMessage } = require('./bot');
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const { sendMessage } = require('./bot')
var jsonParser = bodyParser.json()
app.use(jsonParser)

const port = 3000

let sendMessagesList = []
let messageSendingServiceRunning = false

app.post('/sendMessage', (req, res) => {
    sendMessagesList.push({ phone: req.body.phone, message: req.body.message })
    res.send(sendMessagesList)
    if (!messageSendingServiceRunning) {
        messageSendingService()
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

let messageSendingService = () => {
    messageSendingServiceRunning = true
    async function send() {
        await sendMessage(sendMessagesList[0].phone, sendMessagesList[0].message)
        onSend()
    }
    function onSend() {
        sendMessagesList.shift()
        if (sendMessagesList.length != 0) {
            send()
        } else {
            messageSendingServiceRunning = false
        }
    }
    if (sendMessagesList.length != 0) {
        send()
    } else {
        messageSendingServiceRunning = false
    }
}