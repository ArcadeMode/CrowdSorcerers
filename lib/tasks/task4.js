const Task = require("./task");
const Update = require("../location-data/update");
const NearbySpots = require("../util/nearby-spots");
const SpotsIO = require("../util/spots-io");

module.exports = class Task4 extends Task {

    constructor(conversation, previousSpot) {
        super(conversation);

        this.spotsInNeedOfUpdate = NearbySpots.findInNeedOfUpdate(previousSpot, previousSpot.floor);
        this.currentSpotInNeedOfUpdate = this.spotsInNeedOfUpdate.pop();
        this.spotsCheckedByUserCount = 0;
        this.startTimer();

        if(!this.currentSpotInNeedOfUpdate) {
            console.error("NO SPOT IN NEED OF UPDATE?!");
        }

        this.stages = [
            {
                message: "Since you are (going) there, could you tell me how many seats are available at: " + this.currentSpotInNeedOfUpdate.toString() + "?",
                response_processor: (msg) => {
                    if(!(msg && msg.text)) {
                        return { message: "I did not understand that" }
                    }
                    let number = parseInt(msg.text.replace( /^\D+/g, ''));
                    if(msg.text.toLowerCase().indexOf("no") > -1){
                        this.currentSpotInNeedOfUpdate = undefined;
                        this.currentStage++;
                    } else if(Number.isInteger(number)) {
                        this.spotsCheckedByUserCount += 1;
                        //Update Database
                        this.currentSpotInNeedOfUpdate.append(number);
                        this.currentSpotInNeedOfUpdate = this.spotsInNeedOfUpdate.pop();
                        if(this.currentSpotInNeedOfUpdate) {
                            //when undefined could cause errors
                            this.stages[0].message = "Could you help me with another study spot? how many seats are available at: " + this.currentSpotInNeedOfUpdate.toString();
                        }
                        this.currentStage++;
                        this.endTimerAndSave(4);
                    } else {
                        return {message: "I did not understand that 😢, could you indicate the amount of seats as a number?"}
                    }

                    if(this.spotsInNeedOfUpdate.length === 0) {
                        //we ran out of spots
                        this.currentStage = this.stages.length - 1; //set to last stage
                    }
                }
            },
            {
                message: "Thanks for helping me out, I can use this information to help other students find a spot!",
            }
        ];
    }

    //Overrides Task.nextMessage(msg)
    nextMessage(msg) {
        if(this.currentStage === -1) {
            this.currentStage++;
        } else {
            const res = this.stages[this.currentStage].response_processor(msg);
            if(this.currentStage === this.stages.length - 1) { //LAST STAGE IS TASK END
                if(this.spotsCheckedByUserCount < 3 && this.currentSpotInNeedOfUpdate) {
                    this.currentStage = 0; //reset to first stage of this task
                } else {
                    this.conversation.activeTaskFinished(this.spotsCheckedByUserCount);
                }
                return this.stages[this.currentStage];
            }
            if(res) { return res; }
        }
        return this.stages[this.currentStage];
    }
};
