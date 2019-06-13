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
        // Negative Check
        if(availableSeats < 0){
            availableSeats = 0;
            console.log("NEGATIVE DETECTED");
            return false;
        } 
        // Overflow Check
        else if(availableSeats > (this.capacity * 1.5)){
            availableSeats = Math.floor(this.capacity * 1.5);
            console.log("OVERFLOW DETECTED");
            return false;
        } 

        this.updates = this.updates.filter(u => (new Date(u.timestamp).getTime() / 60000 + 30) > (new Date().getTime() / 60000));
        
        // Walgelijke fix maar voor test purposes SORRY!!!! :(
        let seat_list = this.updates.filter(function(update) {
                if(!(update instanceof Update)){
                    return update.seatsAvailable;
                }
            }).map(update => update.seatsAvailable);
        // Outlier Check
        if(seat_list.length > 2){
            const average = seat_list => seat_list.reduce((sum, value) => sum + value) / seat_list.length;
            const avg = average(seat_list);
            const standardDeviation = Math.sqrt(average(seat_list.map(value => (value - avg) ** 2)));
            const diff = Math.abs(availableSeats - avg);
            
            if(standardDeviation === 0){
                standardDeviation = 2;
            }

            // We don't append it to the database without notifying the user
            if( diff < standardDeviation*3) {
                availableSeats = avg;
                console.log("OUTLIER DETECTED")
                return true;
            }
        }

        const update = new Update(new Date().getTime(), availableSeats);
        this.updates.push(update);
        SpotIO.updateSpot(this);
        return true;
    }

    toString(){
        return "\""+this.description + "\" on floor " + this.floor;
    }
}

