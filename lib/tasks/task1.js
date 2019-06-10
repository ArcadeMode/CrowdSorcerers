const Task = require("./task");

module.exports = class Task1 extends Task {

    //TODO define subtasks



    constructor(conversation) {
        super();
        this.conversation = conversation;
        this.currentStage = -1;
        this.stages = [
            {
                message: "What time of the day do you prefer to study (morning/afternoon/evening)?",
                photo: "location.jpg",
                response_processor: (msg) => {
                    const msgBody = msg.text.toLowerCase();
                    if(msgBody.indexOf("morning") > -1) {
                        conversation.setPreferredTime(0);
                        this.currentStage++;
                        this.coins += 2;
                    } else if(msgBody.indexOf("afternoon") > -1) {
                        conversation.setPreferredTime(1);
                        this.currentStage++;
                        this.coins += 2;
                    } else if(msgBody.indexOf("evening") > -1) {
                        conversation.setPreferredTime(2);
                        this.currentStage++;
                        this.coins += 2;
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
                            return { message: "I couldn't read this, please specify the dates like this: (mon,tue,wed,thu,fri,sat,sun)" }
                        } else {
                            this.coins += 2;
                            days.push(segment.trim());
                        }
                    }
                    conversation.setPreferredDays(days);
                    this.currentStage++;
                },
            },
            {
                message: "Thank you! You can ask me to help you find a study spot anytime! 😉"
            }
        ];
    }
};
