const jsonspots = require("../../assets/location-data/studyspots-building28.json");
const StudySpot = require("../location-data/study-spot");
const Update = require("../location-data/update");
const fs = require('fs');
const suggestions = require("../../assets/suggestions.json");

class SpotsIO {

    getSpots() {
        if(!this.spots) {
            this.spots = [];
            jsonspots.forEach(function (spot) {
                const studyspot = new StudySpot(spot);
                spot.updates.forEach(function (update) {
                    studyspot.updates.push(new Update(update.timestamp,update.seatsAvailable))
                });
                studyspots.push(studyspot);
            });

            this.spots = studyspots;
        }

        return this.spots;
    }

    updateSpot(studyspot) {
        const studyspots = this.spots.map(spot => {
            if(spot.description === studyspot.description && spot.floor === studyspot.floor) {
                return studyspot;
            }
            return spot;
        });
        const json  = JSON.stringify(studyspots);
        
        fs.writeFile('./assets/location-data/studyspots-building28.json', json, 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }

    static writeSuggestionToFile(msg){
        
        suggestions.push({ description: msg });
        const json  = JSON.stringify(suggestions);
        fs.writeFile('./assets/suggestions.json', json, 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }
}

module.exports = new SpotsIO();
