const SpotsIO = require("../util/spots-io");

module.exports = class Task {

    constructor(conversation) {
        // Init first subtask
        this.currentSubTask = null;

        // Init timestamp last interaction
        this.lastInteraction = -1;
        this.currentStage = -1;
        this.stages = [];
        this.conversation = conversation;
        
    }

    nextMessage(msg) {
        if (this.currentStage === -1) {
            this.startTimer();
            this.currentStage++;
        } else {
            let res;
            if (this.stages[this.currentStage].hasOwnProperty("response_processor")) {
                res = this.stages[this.currentStage].response_processor(msg);
            }
            if (this.currentStage === this.stages.length - 1) { //LAST STAGE IS TASK END
                this.conversation.activeTaskFinished(1);
                return this.stages[this.currentStage];
            }
            if (res) {
                return res;
            }
        }
        return this.stages[this.currentStage];
    }

    startTimer(){
        this.startTime = new Date().getTime();
    }

    endTimerAndSave(taskNr){
        const endTime = new Date().getTime();
        const diff = endTime - this.startTime;
        const seconds = diff/1000;
        if(!Number.isInteger(taskNr)) {
            throw "MISSING TASKNR IN TIMER END"
        }
        SpotsIO.writeTimeForTasksToFile(seconds, taskNr);
    }
};
