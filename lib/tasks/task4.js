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
                message: "Hey there! Could you tell me how many study spots are available at: " + this.currentSpotInNeedOfUpdate.toString(),
                response_processor: (msg) => {
                    var number = msg.text.replace( /^\D+/g, '');
                    if(Number.isInteger(parseInt(number))) {
                        this.spotsCheckedByUserCount++
                        this.currentStage++;
                        //TODO
                        //UPDATE DATABASE
                        return {message: "starting? " + this.spotsCheckedByUserCount};
                    } else {
                        return {message: "I did not understand that 😢, please answer NORMALLY YOU FUCK."}
                    }
                    
                },
            },
            {
                message: "That was it",
                response_processor: (msg) => {
                    //const msgBody = msg.text.toLowerCase();
                    this.currentStage++;
                    this.spotsCheckedByUserCount++;
                    return {message: "Yeah this is iteration " + this.spotsCheckedByUserCount};
                },
            }, {
            message: ""
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
                if(this.spotsCheckedByUserCount < 3) {
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
