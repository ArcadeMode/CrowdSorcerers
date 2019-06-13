const jsonspots = require("../../assets/location-data/studyspots-building28.json");
const Update = require("../location-data/update");
const fs = require('fs');
const suggestions = require("../../assets/suggestions.json");
const responseTimes = require("../../assets/responseTimes.json");

class SpotsIO {

    getSpots() {
        if(!this.spots) {
            const StudySpot = require("../location-data/study-spot");
            this.spots = [];
            jsonspots.forEach(spot => {
                const studyspot = new StudySpot(spot);
                spot.updates.forEach(function (update) {
                    studyspot.updates.push(new Update(update.timestamp,update.seatsAvailable))
                });
                this.spots.push(studyspot);
            });
        }
        return this.spots;
    }

    updateSpot(studyspot) {
        const studyspots = this.spots.map(spot => spot.description === studyspot.description && spot.floor === studyspot.floor
            ? studyspot : spot);
        const json  = JSON.stringify(studyspots);
        fs.writeFile('../assets/location-data/studyspots-building28.json', json, 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }

    writeSuggestionToFile(msg){
        
        suggestions.push({ description: msg });
        const json  = JSON.stringify(suggestions);
        fs.writeFile('../assets/suggestions.json', json, 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }

    writeTimeForTasksToFile(seconds, taskNumber){
        
        responseTimes[taskNumber-1].push(seconds);
        const json  = JSON.stringify(responseTimes);
        fs.writeFile('./assets/responseTimes.json', json, 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }
}

module.exports = new SpotsIO();
