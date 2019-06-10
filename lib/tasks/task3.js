const Task = require("./task");
const SpotsIO = require("../util/spots-io");
const Update = require("../location-data/update");
const StudySpot = require("../location-data/study-spot");
var fs = require('fs');

module.exports = class Task3 extends Task {

    //TODO define subtasks



    constructor(conversation) {
        super();
        this.conversation = conversation;
        this.long = 0.00;
        this.lat = 0.00;
        this.floor = 0;
        this.nearbySpotsMessage = "";
        this.nearbySpots = [];
        this.currentSpot = 0;


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
                        const spots = this.fetchSpots();
                        return {message: spots}
                    }else{
                        return {message: "Please provide a number between 0-9"}
                    }
                    
                },
            },
            {
                
                message: "Please provide a number between 1-3?",
                response_processor: (msg) => {
                    const msgBody = msg.text.toLowerCase();
                    if(/^\d$/.test(msgBody) && parseInt(msgBody) > 0 && parseInt(msgBody) <3){
                        this.spot = parseInt(msgBody);
                        this.currentStage= this.currentStage + 2;

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
                    this.writeSuggestionToFile(msgBody);
                    
                },
            },
            {
                
                message: "How many seats are there currently available at your study spot?",
                response_processor: (msg) => {
                    if(/^\d$/.test(msg.text)){
                        const seats = parseInt(msg.text);
                        this.currentStage++;
                        const currSpot = this.nearbySpots[this.spot -1];
                        this.updateSpots(seats, msg.date, currSpot);

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

    updateSpots(seats, timestamp, currSpot){
        const studyspots = SpotsIO.getSpotsFromFile();
        studyspots.forEach(function (spot) {

            if(spot.description === currSpot.description){
                const update = new Update(timestamp, seats);
                spot.updates.push(update);
            }


        });

        SpotsIO.writeSpotsToFile(studyspots);

    }

    fetchSpots(){
        const studyspots = SpotsIO.getSpotsFromFile();
        let bestDist = 100000;
        let best2Dist = 100000;
        let best3Dist = 100000;
        let bestSpot;
        let best2Spot;
        let best3Spot;
        
        const long = this.long;
        const lat = this.lat;

        studyspots.forEach(function (spot) {
            let dist = Math.sqrt((spot.longitude - long) ** 2 + (spot.latitude - lat) ** 2);
            if (dist < bestDist) {
                bestDist = dist;
                bestSpot = spot;
            }else if(dist > bestDist && dist < best2Dist){
                best2Dist = dist;
                best2Spot = spot;
            }else if(dist > best2Dist && dist < best3Dist){
                best3Dist = dist;
                best3Spot = spot;
            }

        });
        this.nearbySpots = [bestSpot, best2Spot, best3Spot];
        return "Which of these spots is the one you are currently sitting at? \n 1:  " + bestSpot.toString() + " \n 2:  " + best2Spot.toString() + " \n 3:  " + best3Spot.toString() +  "";
    }


    writeSuggestionToFile(msg){
        const suggestions = require("./assets/suggestions.json");
        suggestions.push({ description: msg });

        const json  = JSON.stringify(suggestions);
        fs.writeFile('./assets/suggestions.json', json, 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        });
    }
};
