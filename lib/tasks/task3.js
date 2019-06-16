const Task = require("./task");
const SpotsIO = require("../util/spots-io");
const Update = require("../location-data/update");
const StudySpot = require("../location-data/study-spot");
const NearbySpots = require("../util/nearby-spots");
var fs = require('fs');

module.exports = class Task3 extends Task {

    constructor(conversation) {
        super();
        this.conversation = conversation;
        this.longitude = 0.00;
        this.latitude = 0.00;
        this.floor = 0;
        this.nearbySpotsMessage = "";
        this.nearbySpots = [];
        this.spot = -1;


        this.stages = [
            {
                message: "Hi, are you currently studying?",
                response_processor: (msg) => {
                    this.startTimer();
                    if(!msg.text) return {message: "I could not understand this, please answer yes/no."}
                    const msgBody = msg.text.toLowerCase();
                    if (msgBody.indexOf("yes") > -1) {
                        this.currentStage++;
                    } else {
                        this.currentStage = this.stages.length - 1;
                    }
                },
            },
            {
                message: "Could you send me your location?",
                response_processor: (msg) => {
                    if (!msg.location) {
                        return {message: "That is not your location, please send me your location?"};
                    }
                    this.latitude = msg.location.latitude;
                    this.longitude = msg.location.longitude;
                    this.currentStage++;

                },
            },
            {
                message: "Thank you for sharing! At what floor are you?",
                response_processor: (msg) => {
                    if(!msg.text) return {message: "I could not understand this, please send a number."};
                    const msgBody = msg.text.toLowerCase();
                    if (/^\d$/.test(msgBody)) {
                        this.floor = parseInt(msgBody);
                        this.currentStage++;
                        this.nearbySpots = NearbySpots.getnearestslocation(this.longitude, this.latitude, this.floor);
                        this.stages[this.currentStage].message = "Which of these spots is the one you are currently sitting at (provide a number )? \n 1:  "
                            + this.nearbySpots[0].toString() + " \n 2:  "
                            + this.nearbySpots[1].toString() + " \n 3:  "
                            + this.nearbySpots[2].toString() + "\n 4:  none of the above";
                    } else {
                        return {message: "Please provide a number between 0-9"}
                    }

                },
            },
            {              
                message: "",//set by previous stage
                response_processor: (msg) => {
                    if(!msg.text) return {message: "I could not understand this, please send a number."}
                    const msgBody = msg.text.toLowerCase();
                    if(/^\d$/.test(msgBody) && parseInt(msgBody) > 0 && parseInt(msgBody) <4){
                        this.spot = parseInt(msgBody);
                        this.currentStage = this.currentStage + 2;

                    } else if (/^\d$/.test(msgBody) && parseInt(msgBody) === 4) {
                        this.currentStage++;
                    } else {
                        return {message: "Please provide a number between 1-4"}
                    }

                },
            },
            {
                message: "Could you provide a description for your (new) current location, so I could verify and add it to my database?",
                response_processor: (msg) => {
                    if (!msg.text) return {message: "Send text please!"};
                    const msgBody = msg.text.toLowerCase();
                    this.currentStage = this.currentStage + 2;
                    SpotsIO.writeSuggestionToFile(msgBody);

                },
            },
            {

                message: "How many seats are there currently available at your study spot?",
                response_processor: (msg) => {
                    if(!msg.text) return {message: "I could not understand this, please send a number."};
                    if(Number.isInteger(parseInt(msg.text.replace( /^\D+/g, '')))){
                        const seats = parseInt(msg.text);
                        
                        const currSpot = this.nearbySpots[this.spot -1];
                        
                        let result = currSpot.append(seats);
                        if(!result){
                            return {message: "This number is either negative or extends the possible amount of seats available at the study spot, please provide a valid number."}
                        }
                        this.endTimerAndSave(3);
                        this.currentStage++;
                    }else{
                        return {message:"I could not understand this, please send a number."}
                    } 

                },
            },
            {
                message: "Thank you for your help! You can ask me to help you find a study spot anytime! 😉"
            }
        ];
    }

};
