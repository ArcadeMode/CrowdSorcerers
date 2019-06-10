const spots = require("../../assets/location-data/studyspots-building28.json");
const StudySpot = require("../location-data/study-spot");
const Update = require("../location-data/update");
var fs = require('fs');

module.exports = class SpotsIO{
    
    static getSpotsFromFile(){
        let studyspots = [];

        spots.forEach(function (spot) {
            const updates = [];
            
            spot.updates.forEach(function (update) {
                updates.push(new Update(update.timestamp,update.seatsAvailable))
            });

            const studyspot = new StudySpot(spot.lat, spot.lng, spot.desc, spot.floor, spot.building, spot.updates, spot.capacity);
            studyspots.push(studyspot);
        });

        return studyspots;
    }

    static writeSpotsToFile(studyspots){
        const json  = JSON.stringify(studyspots);
        
        fs.writeFile('./assets/location-data/studyspots-building28.json', json, 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        });
    }
}