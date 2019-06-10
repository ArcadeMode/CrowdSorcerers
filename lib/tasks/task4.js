const Task = require("./task");
const NearbySpots = require("../util/nearby-spots");
module.exports = class Task4 extends Task {

    constructor(conversation, previousSpot) {
        super(conversation);

        this.spotsInNeedOfUpdate = NearbySpots.findInNeedOfUpdate({latitude: previousSpot.lat, longitude: previousSpot.lng}, previousSpot.floor);
        this.currentSpotInNeedOfUpdate = this.spotsInNeedOfUpdate.pop();
        if(!this.currentSpotInNeedOfUpdate) {
            throw "NO SPOT IN NEED OF UPDATE?!"
        }

        this.stages = [
            {
                message: "Hey there! Could you tell me how many study spots are available at: " + this.currentSpotInNeedOfUpdate.toString(),
                response_processor: (msg) => {
                    var number = msg.text.match(/\d+/)[0] // "3"
                    if(Number.isInteger(number)) {
                        this.spotsCheckedByUserCount = number
                    } else {
                        return {message: "I did not understand that 😢, please answer NORMALLY YOU FUCK."}
                    }
                },
            }
        ];
    }
};
