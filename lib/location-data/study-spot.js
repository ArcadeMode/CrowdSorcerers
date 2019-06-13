const Update = require('./update');
const SpotIO = require('../util/spots-io');

module.exports = class StudySpot {

    constructor(spot) {
        this.setProperties(spot.latitude, spot.longitude, spot.description, spot.floor, spot.buildingnr, spot.updates, spot.capacity)
    }

    setProperties(latitude,longitude, description, floor, buildingnr, updates, capacity) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.floor = floor;
        this.buildingnr = buildingnr;
        this.updates = updates;
        this.capacity = capacity;
    }

    append(availableSeats){
        const update = new Update(new Date().getTime(), availableSeats);
        this.updates.push(update);
        this.updates = this.updates.filter(u => (new Date(u.timestamp).getTime() / 60000 + 30) > (new Date().getTime() / 60000));
        SpotIO.updateSpot(this);
    }

    toString(){
        return "\""+this.description + "\" on floor " + this.floor;
    }
}

