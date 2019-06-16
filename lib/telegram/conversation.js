// Import API
const Task1 = require('../tasks/task1');
const Task2 = require('../tasks/task2');
const Task3 = require('../tasks/task3');
const Task4 = require('../tasks/task4');
const Task5 = require('../tasks/task5');

module.exports = class Conversation {

    constructor(name, chatId) {
        this.bot = require('../app').bot;
        this.chatId = chatId;
        this.name = name;
        this.coins = 0;
        this.activeTask = new Task1(this); //when conversation is first created, start with task 1 (registration chat)
        this.preferredBuildings = [];
        this.preferredTime = undefined; //takes value 0,1,2 (morning, afternoon, evening)
        this.preferredDays = [];
    }

    resetTask() {
        this.activeTask = undefined;
    }

    overrideTask(number) { //TODO: switch to correct task classes
        switch (number) {
            case 3:
                this.activeTask = new Task3(this);
                break;
            default:
                throw "CANNOT SWITCH TO Task" + number;
        }
    }

    nextMessage(msg) {
        const msgBody = msg && msg.text ? msg.text.toLowerCase() : "";
        if (msgBody.indexOf("study") > -1) {
            if (this.coins >= 25) {
                this.activeTask = new Task2(this);
            } else {
                this.bot.sendMessage(this.chatId, "You do not have enough coins to request a study spot!\n" + "Current amount of coins: " + this.coins + "\n" + "Required amount of coins: 25");
            }
        } else if (msgBody.indexOf("coin") > -1) {
            this.bot.sendVideo(this.chatId, "Currently you have an amount of " + this.coins + " coins!", "treasure.gif");
            return;
        }
        if (this.activeTask) {
            return this.activeTask.nextMessage(msg);
        }
    }

    setPreferredTime(time) {
        this.preferredTime = time;
    }

    setPreferredDays(days) {
        this.preferredDays = days;
    }

    async activeTaskFinished(multiplier) {
        let isTask2 = false;
        const taskRef = this.activeTask;
        if (this.activeTask instanceof Task2) {
            isTask2 = true;
            if (this.activeTask.bestSpots.length > 0) {
                //only if we found a spot subtract (else we subtract money without providing a study spot)
                this.coins -= 25;
                new Promise(function (resolve) {
                    setTimeout(resolve, 2000); //wait 2 seconds before notifying of subtraction
                }).then(() => {
                    this.bot.sendMessage(this.chatId, "I've substracted 25 coins from your balance leaving you with " + this.coins + " coins.");
                });
                //also, continue with task 4
                this.activeTask = new Task4(this, this.activeTask.bestSpots[0]);
            } else {
                this.resetTask(); //no result, reset conversation
            }

        } else if (this.activeTask instanceof Task4 && !(this.previousTask && this.previousTask instanceof Task3)) {
            this.activeTask = new Task5(this);
            new Promise(function (resolve) {
                setTimeout(resolve, 20000); //wait 20 seconds before continuing conversation
            }).then(() => {
                this.bot.sendMessage(this.chatId, this.activeTask.nextMessage().message);
            });
        } else if (this.activeTask instanceof Task3 && this.activeTask.nearbySpots[this.activeTask.spot]) {
            this.activeTask = new Task4(this, this.activeTask.nearbySpots[this.activeTask.spot]);
        } else {
            this.activeTask = undefined;
        }

        if(this.activeTask instanceof Task4) {
            new Promise(function (resolve) {
                setTimeout(resolve, 10000); //wait 10 seconds before continuing conversation
            }).then(() => {
                this.bot.sendMessage(this.chatId, this.activeTask.nextMessage().message);
            });
        }

        // if we finished anything but task 2, give coins
        if (!isTask2 && multiplier > 0) {
            let amount = (25 * multiplier);
            this.coins += amount;
            await this.bot.sendVideo(this.chatId, "I've added " + amount + " coins to your balance, you now have " + this.coins + " coins!", "coins.gif");
        }
        this.previousTask = taskRef;
    }

};
