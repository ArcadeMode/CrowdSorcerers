const Task = require("./task");
const SpotsIO = require("../util/spots-io");

module.exports = class Task1 extends Task {

    constructor(conversation) {
        super(conversation);
        this.stages = [
            {
                message: "What time of the day do you prefer to study (morning/afternoon/evening)?",
                response_processor: (msg) => {

                    const msgBody = msg.text.toLowerCase();
                    if(msgBody.indexOf("morning") > -1) {
                        conversation.setPreferredTime(0);
                        this.currentStage++;
                    } else if(msgBody.indexOf("afternoon") > -1) {
                        conversation.setPreferredTime(1);
                        this.currentStage++;
                    } else if(msgBody.indexOf("evening") > -1) {
                        conversation.setPreferredTime(2);
                        this.currentStage++;
                    } else {
                        return {message: "I did not understand that 😢, please answer morning/afternoon or evening."}
                    }
                },
            },
            {
                message: "Which day(s) of the week do you usually study? (mon,tue,wed,thu,fri,sat,sun)",
                response_processor: (msg) => {
                    const msgBody = msg.text.toLowerCase();
                    const days = [];
                    for(let segment of msgBody.split(",")) {
                        if(["mon","tue","wed","thu","fri","sat","sun"].indexOf(segment.trim().toLowerCase()) === -1) {
                            return { message: "I'm having trouble interpreting that, it'd help me a lot if you specify the dates like this: mon,tue,wed,thu,fri,sat,sun" }
                        } else {
                            days.push(segment.trim());
                        }
                    }
                    conversation.setPreferredDays(days);
                    this.currentStage++;
                    this.endTimerAndSave(1);
                },
            },
            {
                message: "Thank you! You can ask me to help you find a study spot anytime! 😉"
            }
        ];
    }
};
