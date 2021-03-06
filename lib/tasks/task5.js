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
                            message: "Oh okay, if it was a bad recommendation I will try to do better next time!"
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
                    if (msgBody.indexOf("yes") > -1) {
                        this.currentStage++;
                        return;
                    }
                    if (msgBody.indexOf("no") > -1) {
                        this.currentStage = -1;
                        conversation.resetTask();
                        return {
                            message: "That is too bad to hear. I will try to be of better service next time."
                        }
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
