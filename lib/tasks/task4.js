const Task = require("./task");
const NearbySpots = require("");
module.exports = class Task4 extends Task {

    constructor(conversation, previousSpot) {
        super(conversation);
        this.stages = [
            {
                message: "Task 4 yo",
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
            }
        ];
    }
};
