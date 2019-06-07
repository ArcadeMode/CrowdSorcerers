module.exports = class Update {

    seatsAvailable;
    timestamp;


    constructor(timestamp, seatsAvailable){
        this.seatsAvailable = seatsAvailable;
        this.timestamp = timestamp;
    }

}