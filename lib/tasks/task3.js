const Task = require("./task");
const SpotsIO = require("../util/spots-io")

module.exports = class Task3 extends Task {

    //TODO define subtasks



    constructor(conversation) {
        super();
        this.conversation = conversation;
        this.long = 0.00;
        this.lat = 0.00;
        this.floor = 0;
        this.currentStage = -1;
        this.nearbySpotsMessage


        this.stages = [
            {
                message: "Hi, are you currently studying?",
                response_processor: (msg) => {
                    const msgBody = msg.text.toLowerCase();
                    if(msgBody.indexOf("yes") > -1){
                        this.currentStage++;
                    }else{
                        this.currentStage = this.stages.length -1;
                        return {message: "Oke then"}
                    }

                },
            },
            {
                message: "Could you sent your location?",
                response_processor: (msg) => {
                    if (!msg.location) {
                        return {message: "That is not your location, please send me your location?"};
                    }
                    this.lat = message.location.latitude;
                    this.long = message.location.longitude;
                    this.currentStage++;
                    
                },
            },
            {
                message: "On what floor are you now?",
                response_processor: (msg) => {
                    if(/^\d$/.test(msg)){
                        this.floor = parseInt(msg);
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
                    if(/^\d$/.test(msg) && parseInt(msg) > 0 && parseInt(msg) <3){
                        this.floor = parseInt(msg);
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
                    //TODO WritetoFile
                    
                },
            },
            {
                
                message: "How many seats are there currently available at your study spot?",
                response_processor: (msg) => {
                    if(/^\d$/.test(msg)){
                        const seats = parseInt(msg);
                        this.currentStage++;
                        //TODO Update seats 
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

        this.nearbySpotsMessage = "Which of these spots is the one you are currently sitting at? (1: " + bestSpot.description +  ", 2: " + best2Spot.description + ", 3: " + best3Spot.description +  ")";



    }

    nextMessage(msg) {
        if(this.currentStage === -1) {
            this.currentStage++;
        } else {
            const res = this.stages[this.currentStage].response_processor(msg);
            if(this.currentStage === this.stages.length - 1) { //LAST STAGE IS TASK END
                this.conversation.activeTaskFinished();
                return this.stages[this.currentStage];
            }
            if(res) { return res; }
        }
        return this.stages[this.currentStage];
    }
};
