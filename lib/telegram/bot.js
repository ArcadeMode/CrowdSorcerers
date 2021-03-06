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

    constructor(token) {
        this.api = new telegram({ token: token, updates: { enabled: true } });
        this.conversations = new Map();
        this.api.on('message', this.processMessage.bind(this));
    }

    async processMessage(message) {
        if(message.from.is_bot) return;

        const chatId = message.chat.id;
        const conversation = this.getOrCreateConversation(chatId, message.chat.username);

        if(message.text && message.text.indexOf('/task3') === 0) {
            const userId = message.text.replace("/task3 ","").trim();
            const selectedConvo = this.findConversation(userId);
            if(!selectedConvo) {
                await this.sendMessage(chatId, "Task 3 not assigned, userId " + userId + " not found");
                return;
            }
            selectedConvo.overrideTask(3);
            await this.sendMessage(chatId, "Task 3 assigned to " + selectedConvo.name);
            await this.sendMessage(selectedConvo.chatId, selectedConvo.nextMessage(undefined).message);
            return;
        }

        const res = conversation.nextMessage(message);
        if(!res) { return; } //cancel in case no need to continue conversation
        if(res.photo) {
            this.sendPhoto(chatId, res.message, res.photo);
        } else if (res.location) {
            this.sendLocation(chatId, res.location);
            this.sendMessage(chatId, res.message);
        } else {
            this.sendMessage(chatId, res.message);
        }
    };

    sendLocation(chatId, location) {
        return this.api.sendLocation({
            chat_id: chatId,
            latitude: location.lat,
            longitude: location.lng
        });
    }


    getOrCreateConversation(chatId, name) {
        if(!this.conversations.has(chatId)) {
            this.conversations.set(chatId, new Conversation(name, chatId));
        }
        return this.conversations.get(chatId);
    }

    sendMessage(chatId, msg) {
        return this.api.sendMessage({
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

    sendVideo(chatId, caption, video) {
        const filePath = path.join(__dirname, '..', '..', 'assets', video);
        return this.api.sendVideo({
            chat_id: chatId,
            caption: caption,
            video: filePath
        }).then(data => {
            console.log(util.inspect(data, false, null));
        })
    }


    findConversation(userId) {
        let convos = this.conversations.entries();
        let entry = convos.next();
        while(!entry.done) {
            const convo = entry.value[1];
            if(convo && convo.name.toLowerCase() === userId.toLowerCase()) {
                return convo;
            }
            entry = convos.next();
        }
    }
};
