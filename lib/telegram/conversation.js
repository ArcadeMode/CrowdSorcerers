// Import API
const Task1 = require('../tasks/task1');

module.exports = class Conversation {

    constructor(){
        this.coins = 0;
        this.activeTask = new Task1(this); //when conversation is first created, start with task 1 (registration chat)
        this.preferredBuildings = [];
        this.preferredTime = undefined; //takes value 0,1,2 (morning, afternoon, evening)
        this.preferredDays = [];
    }

    nextMessage(msg) {
        if(!this.activeTask) {
            //TODO start (TASK 2!)
            console.error("not implemented");
            process.exit(1);
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
    }

};
