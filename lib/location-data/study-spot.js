const Update = require('./update');

module.exports = class StudySpot{

    constructor(latitude,longitude, description, floor, buildingnr, updates, capacity){
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.floor = floor;
        this.buildingnr = buildingnr;
        this.updates = updates;
        this.capacity = capacity;
    }

    getAvailableSeats(){
        var availableSeats= 0;
        //Fecth from Updates

        return availableSeats
    }

    append(update){
        this.updates.push(update);
    }

    toString(){
        return this.description + " - floor: " + this.floor; 
    }
}