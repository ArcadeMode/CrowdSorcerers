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
        if(this.currentStage === -1) {
            this.currentStage++;
        } else {
            const res = this.stages[this.currentStage].response_processor(msg);
            if(this.currentStage === this.stages.length - 1) { //LAST STAGE IS TASK END
                this.conversation.activeTaskFinished(1);
                return this.stages[this.currentStage];
            }
            if(res) { return res; }
        }
        return this.stages[this.currentStage];
    }
    
    
};
