const Task = require("./task");
const SpotsIO = require("../util/spots-io");

module.exports = class Task5 extends Task {

    constructor(conversation) {
        super(conversation);
        this.stages = [
            {
                message: "Hey there, did you go to the study spot I suggested?",
                response_processor: (msg) => {
                    this.startTimer();
                    const msgBody = msg.text.toLowerCase();
                    if (msgBody.indexOf("yes") > -1) {
                        this.currentStage++;
                        return;
                    }
                    if (msgBody.indexOf("no") > -1) {
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
                message: "Was there a seat available for you?",
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
                    if (msgBody.indexOf("yes") > -1 || msgBody.indexOf("no") > -1) {
                        this.currentStage++;
                        this.endTimerAndSave(5);
                        return;
                    }
                    return { message: "I could not understand that. Please give a yes/no answer." };
                }
            },
            {
                photo: "yay-thank-you.jpg",
                message: "Thank you for your input!"
            }
        ];
    }
};
