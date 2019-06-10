const spots = require("../../assets/location-data/studyspots-building28");
// const StudySpot = require("../locationdata/studyspot");
// const Update = require("../locationdata/update");
var fs = require('fs');

module.exports = class SpotsIO{
    
    getSpotsFromFile(){
        let studyspots = [];

        spots.forEach(function (spot) {
            const updates = [];
            
            spot.updates.forEach(function (update) {
                updates.fill(new Update(update.timestamp,update.seatsAvailable))
            });

            const studyspot = new StudySpot(spot.lat, spot.lng, spot.desc, spot.floor, spot.building, updates);
            studyspots.fill(studyspot);
        });

        return studyspots;
    }

    writeSpotsToFile(studyspots){
        const json  = JSON.stringify(studyspots);
        
        fs.writeFile('../../assets/location-data/studyspots-building28', json, 'utf8', callback);
    }
}