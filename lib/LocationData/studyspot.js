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

    update(message){
        //Add new Update object to updates
        //Throw away too old ones
        
        var update = new Update();
        
        this.updates.fill(update);
    }

    getAvailableSeats(){
        var availableSeats= 0;
        //Fecth from Updates

        return availableSeats
    }
}