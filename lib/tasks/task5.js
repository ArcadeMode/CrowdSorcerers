const Task = require("./task");

module.exports = class Task5 extends Task {

    constructor(conversation) {
        super(conversation);
        this.stages = [
            {
                message: "Hey there, did you go to the study spot I suggested?",
                response_processor: (msg) => {
                    this.startTimer();
                    const msgBody = msg.text.toLowerCase();
                    if (msgBody.indexOf("y") > -1) {
                        this.currentStage++;
                        return;
                    }
                    if (msgBody.indexOf("n") > -1) {
                        this.currentStage = -1;
                        
                        conversation.resetTask();


                        return {
                            message: "That is too bad to hear. Hope I can help you next time."
                        }
                    }
                    return {
                        message: "I could not understand that. Please give a yes/no answer."
                    }
                },
            },
            {
                //did go to the spot
                message: "All right, and was there a seat available for you?",
                response_processor: (msg) => {
                    const msgBody = msg.text.toLowerCase();
                    if (msgBody.indexOf("y") > -1) {
                        this.currentStage++;
                        return;
                    }
                    if (msgBody.indexOf("n") > -1) {
                        this.currentStage = -1;
                        conversation.resetTask();
                        return {
                            message: "Too bad to hear. Thank you for your input anyhow!"
                        }
                    }
                    return {
                        message: "I could not understand that. Please give a yes/no answer."
                    }
                }
            },
            {
                //did go to the spot
                message: "All right, and are you still there?",
                response_processor: (msg) => {
                    const msgBody = msg.text.toLowerCase();
                    const seconds = this.endTimerAndSave();
                    SpotsIO.writeTimeForTasksToFile(seconds,1);
                    if (msgBody.indexOf("y") > -1) {
                        this.currentStage++;
                        return;
                    }
                    if (msgBody.indexOf("n") > -1) {
                        this.currentStage++;
                        return;
                    }
                    return {
                        message: "I could not understand that. Please give a yes/no answer."
                    }
                }
            },
            {
                photo: "yay-thank-you.jpg",
                message: "Thank you for your input!"
            }
        ];
    }
};
