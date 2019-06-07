/**
 * Created by marc on 07-Jun-19.
 */
const telegram = require('telegram-bot-api');
const util = require('util');
const fs = require('fs');
const path = require('path');
const Conversation = require('./conversation');

module.exports = class TelegramBot {

    constructor(token) {
        this.api = new telegram({ token: token, updates: { enabled: true } });
        this.conversations = new Map();
        this.api.on('message', this.processMessage.bind(this));
    }

    processMessage(message) {
        if(message.from.is_bot) return;

        const chatId = message.chat.id;
        if(!this.conversations.has(chatId)) {
        this.conversations.set(chatId, new Conversation());
        }
        const res = this.conversations.get(chatId).nextMessage(message);
        if(!res) { return; } //cancel in case no need to continue conversation
        if(res.photo) {
            this.sendPhoto(chatId, res.message, res.photo);
        } else {
            this.sendMessage(chatId, res.message);
        }
        //this.sendMessage(res);
        console.log("tgBot received: ", message);
    };

    sendMessage(chatId, msg) {
        this.api.sendMessage({
            chat_id: chatId,
            text: msg
        }).then(data => {
            console.log(util.inspect(data, false, null));
        }).catch(err => {
            console.log(err);
        });
    }

    sendPhoto(chatId, caption, photo) {
        const filePath = path.join(__dirname, '..', '..', 'assets', photo);
        this.api.sendPhoto({
            chat_id: chatId,
            caption: caption,
            photo: filePath // you can also send file_id here as string (as described in telegram bot api documentation)
        }).then(data => {
            console.log(util.inspect(data, false, null));
        });
    }
};