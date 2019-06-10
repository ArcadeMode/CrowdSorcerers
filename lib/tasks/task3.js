const Task = require("./task");
const SpotsIO = require("../util/spots-io");
const Update = require("../LocationData/update");
var fs = require('fs');

module.exports = class Task3 extends Task {

    //TODO define subtasks



    constructor(conversation) {
        super();
        this.conversation = conversation;
        this.long = 0.00;
        this.lat = 0.00;
        this.floor = 0;
        this.currentStage = -1;
        this.nearbySpotsMessage;
        this.nearbySpots = [];


        this.stages = [
            {
                message: "Hi, are you currently studying?",
                response_processor: (msg) => {
                    const msgBody = msg.text.toLowerCase();
                    if(msgBody.indexOf("yes") > -1){
                        this.currentStage++;
                    }else{
                        this.currentStage = this.stages.length -1;
                    }

                },
            },
            {
                message: "Could you sent your location?",
                response_processor: (msg) => {
                    if (!msg.location) {
                        return {message: "That is not your location, please send me your location?"};
                    }
                    this.lat = msg.location.latitude;
                    this.long = msg.location.longitude;
                    this.currentStage++;
                    
                },
            },
            {
                message: "On what floor are you now?",
                response_processor: (msg) => {
                    const msgBody = msg.text.toLowerCase();
                    if(/^\d$/.test(msgBody)){
                        this.floor = parseInt(msgBody);
                        this.currentStage++;
                        this.spots = fetchSpots();
                    }else{
                        return {message: "Please provide a number between 0-9"}
                    }
                    
                },
            },
            {
                
                message: this.nearbySpotsMessage,
                response_processor: (msg) => {
                    const msgBody = msg.text.toLowerCase();
                    if(/^\d$/.test(msgBody) && parseInt(msgBody) > 0 && parseInt(msgBody) <3){
                        this.spot = parseInt(msgBody);
                        this.currentStage= this.currentStage + 2;
                        this.currentSpot = this.nearbySpots[spot];
                    }else if (msgBody.indexOf("no") > -1 ){
                        this.currentStage++;
                    }else{
                        return {message:"Please provide a number or answer 'no' "}
                    }
                    
                },
            },
            {
                
                message: "Could you provide a description for your current location?",
                response_processor: (msg) => {
                    const msgBody = msg.text.toLowerCase();
                    this.currentStage++;
                    writeSuggestionToFile(msgBody);
                    
                },
            },
            {
                
                message: "How many seats are there currently available at your study spot?",
                response_processor: (msg) => {
                    if(/^\d$/.test(msg.text)){
                        const seats = parseInt(msg.text);
                        this.currentStage++;
                        updateSpots(seats, msg.timestamp)

                    }else{
                        return {message:"Please provide a number"}
                    }

                },
            },
            {
                message: "Thank you! You can ask me to help you find a study spot anytime! 😉"
            }
        ];
    }

    updateSpots(seats, timestamp){
        const studyspots = getSpotsFromFile();
        studyspots.forEach(function (spot) {

            if(spot.description === currentspot.description){
                const update = new Update(timestamp, seats);
                spot.updates.push(update);
            }


        });

        writeSpotsToFile(studyspots);

    }

    fetchSpots(){
        const studyspots = getSpotsFromFile();
        let bestDist = 100000;
        let best2Dist = 100000;
        let best3Dist = 100000;
        


        studyspots.forEach(function (spot) {
            dist = Math.sqrt((spot.longitude - this.long) ** 2 + (spot.latitude - this.lat) ** 2);
            if (dist < bestDist) {
                bestDist = dist;
                bestSpot = spot;
            }else if(dist > bestdist && dist < best2Dist){
                best2Dist = dist;
                best2Spot = spot;
            }else if(dist > best2Dist && dist < best3Dist){
                best3Dist = dist;
                best3Spot = spot;
            }

        });
        this.nearbySpots = [bestdist, best2Dist, best3Dist];
        this.nearbySpotsMessage = "Which of these spots is the one you are currently sitting at? (1: " + bestSpot.description +  ", 2: " + best2Spot.description + ", 3: " + best3Spot.description +  ")";
    }


    writeSuggestionToFile(msg){
        const suggestions = require("../../assets/suggestions");
        suggestions.push({ description: msg });

        const json  = JSON.stringify(suggestions);
        fs.writeFile('../../assets/suggestions', json, 'utf8', callback);
    }
};
