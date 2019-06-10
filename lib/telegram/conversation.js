// Import API
const Task1 = require('../tasks/task1');

module.exports = class Conversation {

    constructor(name){
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
                this.activeTask = new Task1(this);
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
