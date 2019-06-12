const Task = require("./task");
const NearbySpots = require("../util/nearby-spots");

module.exports = class Task2 extends Task {

    constructor(conversation) {
        super(conversation);
        this.currentStage = -1;
        this.floorNumber = -1;
        this.newestLocation = null;
        this.bestSpots = [];
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
                    const floorNumber = parseInt(msgBody.match(/\d+/));
                    if (isNaN(floorNumber)) {
                        return {
                            message: "I could not understand this, please send a number."
                        }
                    }
                    this.floorNumber = floorNumber;
                    this.bestSpots = NearbySpots.getBestSpots(this.newestLocation, this.floorNumber);
                    if (this.bestSpots.length > 0) {
                        this.stages[2] = {
                            message: "I found a spot for you to study at: " + this.bestSpots[0].description + " at building " + this.bestSpots[0].buildingnr + ", floor " + this.bestSpots[0]['floor'],
                            location: {
                                lat: this.bestSpots[0].latitude,
                                lng: this.bestSpots[0].longitude
                            }
                        }
                    }
                    this.currentStage ++;
                }
            },
            {
                message: "Unfortunately I could not find a study spot for you. Hope I can help you another time."
            }
        ];
    }
};