// Import API
const Task1 = require('../tasks/task1');
const Task2 = require('../tasks/task2');
const Task3 = require('../tasks/task3');
const path = require('path');
const bot = require('../app').bot;

module.exports = class Conversation {

    constructor(name, chatId){
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
            //TODO start (TASK 2!)
            this.activeTask = new Task2(this);
            // console.error("not implemented");
            // process.exit(1);
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
        this.activeTask = undefined;
        this.coins += 25;

        //const filePath = path.join(__dirname, '..', '..', 'assets', "coins.gif");
        // this.api.sendVideo({
        //     chat_id: this.chatId,
        //     caption: "Congratulations! You have an amount of " + this.coins + " now!",
        //     video: filePath // you can also send file_id here as string (as described in telegram bot api documentation)
        // }).then(data => {
        //     console.log(util.inspect(data, false, null));
        // });
       // bot.sendVideo(this.chatId, "Congratulations! You have an amount of " + this.coins + " now!", filePath);
    }

};
