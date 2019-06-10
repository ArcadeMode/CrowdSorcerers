/**
 * Created by marc on 07-Jun-19.
 */
const telegram = require('telegram-bot-api');
const util = require('util');
const fs = require('fs');
const path = require('path');
const Conversation = require('./conversation');
const setsUtil = require('../util/sets');

module.exports = class TelegramBot {

    // TODO coins (DANNY)
    // TODO implement task 2 (TIM)
    // TODO initiate task 3+4 (MARC)
    // TODO implement task 3 (TOMAS)
    // TODO (less prio) implement task 4 (MARC)

    constructor(token) {
        this.api = new telegram({ token: token, updates: { enabled: true } });
        this.conversations = new Map();
        this.api.on('message', this.processMessage.bind(this));
    }

    async processMessage(message) {
        if(message.from.is_bot) return;

        const chatId = message.chat.id;
        const conversation = this.getOrCreateConversation(chatId, message.from.first_name);
        const randomConvoKey = setsUtil.getRandomKey(this.conversations);
        const randomConvo = this.conversations.get(randomConvoKey);

        if(message.text && message.text.indexOf('/task3') === 0) {
            randomConvo.overrideTask(3);
            this.sendMessage(chatId, "Task 3 assigned to " + randomConvo.name);
            await sleep(100);
            this.sendMessage(randomConvoKey, randomConvo.nextMessage(undefined).message);
            return;
        } else if(message.text && message.text.indexOf('/task4') === 0) {
            randomConvo.overrideTask(4);
            this.sendMessage(chatId, "Task 4 assigned to " + randomConvo.name);
            await sleep(100);
            this.sendMessage(randomConvoKey, randomConvo.nextMessage(undefined));
            return;
        }

        const res = conversation.nextMessage(message);
        if(!res) { return; } //cancel in case no need to continue conversation
        if(res.photo) {
            this.sendPhoto(chatId, res.message, res.photo);
        } else {
            this.sendMessage(chatId, res.message);
        }
    };

    getOrCreateConversation(chatId, name) {
        if(!this.conversations.has(chatId)) {
            this.conversations.set(chatId, new Conversation(name));
        }
        return this.conversations.get(chatId);
    }

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}