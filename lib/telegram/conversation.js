// Import API
const Task1 = require('../tasks/task1');
const Task2 = require('../tasks/task2');
const Task3 = require('../tasks/task3');
const Task4 = require('../tasks/task4');

module.exports = class Conversation {

    constructor(name, chatId){
        this.bot = require('../app').bot;
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
            if(this.coins >= 25){
                this.activeTask = new Task2(this);
            } else{
                this.bot.sendMessage(this.chatId, "You do not have enough coins to request a study spot!\n" + "Current amount of coins: " +  this.coins+"\n" + "Required amount of coins: 25")
            }
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

    async activeTaskFinished() {
        var isTask2 = false;

        if(this.activeTask instanceof Task2) {
            this.coins -= 25;
            isTask2 = true;
            this.activeTask = new Task4(this, this.activeTask.bestLocations[0]);
        } else if(this.activeTask instanceof Task3) {
          this.activeTask = new Task4(this, this.activeTask.nearbySpots[this.activeTask.spot]);
        } else {
            this.activeTask = undefined;
        }

        // Much wow
        if(!isTask2){
            this.coins += 25;
            await this.bot.sendVideo(this.chatId, "Thanks for helping me out! I've added 25 coins to your balance, you now have " + this.coins + " coins!", "coins.gif");
        } else{
            await this.bot.sendVideo(this.chatId, "I have substracted 25 coins from your treasure chest leaving you with " + this.coins + " coins!", "coins2.gif");
        }
    }

};
