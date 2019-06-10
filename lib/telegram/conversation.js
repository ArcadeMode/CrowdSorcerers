// Import API
const Task1 = require('../tasks/task1');
const Task2 = require('../tasks/task2');
const Task3 = require('../tasks/task3');
const Task4 = require('../tasks/task4');
const bot = require('../app').bot;

module.exports = class Conversation {

    constructor(bot, name, chatId){
        this.bot = bot;
        this.chatId = chatId;
        this.name = name;
        this.coins = 0;
        this.activeTask = new Task1(this); //when conversation is first created, start with task 1 (registration chat)
        this.preferredBuildings = [];
        this.preferredTime = undefined; //takes value 0,1,2 (morning, afternoon, evening)
        this.preferredDays = [];
    }

    overrideTask(number) { //TODO: switch to correct task classes
        switch(number) {
            case 1:
                this.activeTask = new Task1(this);
                break;
            case 2:
                this.activeTask = new Task1(this);
                break;
            case 3:
                this.activeTask = new Task3(this);
                break;
            case 4:
                this.activeTask = new Task1(this);
                break;
            default:
                throw "NO SUCH TASK " + number;
        }
    }

    nextMessage(msg) {
        if(!this.activeTask) {
            this.activeTask = new Task2(this);
        }

        //TODO process message if task active
        return this.activeTask.nextMessage(msg);
    }

    setPreferredTime(time) {
        this.preferredTime = time;
    }

    setPreferredDays(days) {
        this.preferredDays = days;
    }

    activeTaskFinished() {
        if(this.activeTask instanceof Task2) {
            this.activeTask = new Task4(this, this.activeTask.bestLocations[0]);
        } else if(this.activeTask instanceof Task3) {
          this.activeTask = new Task4(this, this.activeTask.nearbySpots[0]); //TODO change 0 for user-selected task index
        } else {
            this.activeTask = undefined;
        }

        // Much wow
        this.coins += 25;
        this.bot.sendVideo(this.chatId, "Congratulations! You have an amount of " + this.coins + " now!", "coins.gif");
    }

};
