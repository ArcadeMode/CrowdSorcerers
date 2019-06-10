const Task = require("./task");
const NearbySpots = require("../util/nearby-spots");

module.exports = class Task4 extends Task {

    constructor(conversation, previousSpot) {
        super(conversation);

        this.spotsInNeedOfUpdate = NearbySpots.findInNeedOfUpdate({latitude: previousSpot.lat, longitude: previousSpot.lng}, previousSpot.floor);
        this.currentSpotInNeedOfUpdate = this.spotsInNeedOfUpdate.pop();
        this.spotsCheckedByUserCount = 0;
        if(!this.currentSpotInNeedOfUpdate) {
            throw "NO SPOT IN NEED OF UPDATE?!"
        }

        this.stages = [
            {
                message: "Since you are (going) there, could you tell me how many study spots are available at: " + this.currentSpotInNeedOfUpdate.toString(),
                response_processor: (msg) => {
                    let number = msg.text.replace( /^\D+/g, '');
                    if(Number.isInteger(parseInt(number))) {
                        this.spotsCheckedByUserCount++;
                        this.currentSpotInNeedOfUpdate = this.spotsInNeedOfUpdate.pop();
                        this.currentStage++;
                        //TODO: UPDATE DATABASE
                    } else {
                        return {message: "I did not understand that 😢, please answer NORMALLY YOU FUCK."}
                    }
                    
                },
            },
            {
                message: "Awesome thanks for your help, I can use this information to help other students find a spot!",
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
                    this.conversation.activeTaskFinished();
                }
                return this.stages[this.currentStage];
            }
            if(res) { return res; }
        }
        return this.stages[this.currentStage];
    }
};
