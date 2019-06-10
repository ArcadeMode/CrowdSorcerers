const Task = require("./task");
const NearbySpots = require("../Util/NearbySpots");

module.exports = class Task2 extends Task {

    constructor(conversation) {
       super(conversation);
        this.currentStage = -1;
        this.floorNumber = -1;
        this.newestLocation = null;
        this.bestLocations = [];
        this.stages = [
            {
                message: "Sure, I'll help you out. Could you send me your location?",
                response_processor: (msg) => {
                    const msgLocation = msg.location;
                    if (!msgLocation) {
                        return {
                            message: "Could you send me your location?"
                        }
                    }
                    this.currentStage++;
                    this.newestLocation = msgLocation;
                },
            },
            {
                message: "Thank you for sharing! At what floor are you?",
                response_processor: (msg) => {
                    const msgBody = msg.text.toLowerCase();
                    const floorNumber = parseInt(msgBody.match(/\d+/)[0]);
                    if (isNaN(floorNumber)) {
                        return {
                            message: "I could not understand this, please send a number."
                        }
                    }
                    this.bestLocations = NearbySpots.calculate(this.newestLocation, this.floorNumber);
                    this.floorNumber = floorNumber;
                    this.currentStage++;
                },
            },
            {
                message: "Thank you. Here I have a list of study spots that may be suitable for you: " +
                    JSON.stringify(this.bestLocations),

            }
        ];
    }
};