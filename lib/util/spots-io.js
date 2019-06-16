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
                studyspot.updates = studyspot.updates.map(update => {
                    //TODO remove debug statement, now always sets existing update-timestamps to NOW
                    return new Update(new Date().getTime(), update.seatsAvailable);
                    //return new Update(update.timestamp, update.seatsAvailable);
                });
                //studyspot.updates.filter(u => (new Date(u.timestamp).getTime() / 60000 + 30) > (new Date().getTime() / 60000));

                this.spots.push(studyspot);
            });
        }
        return this.spots;
    }

    updateSpot(studyspot) {
        const studyspots = this.spots.map(spot => spot.description === studyspot.description && spot.floor === studyspot.floor
            ? studyspot : spot);
        const json  = JSON.stringify(studyspots, null, 4);
        fs.writeFile('../assets/location-data/studyspots-building28.json', json, 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }else{
                return console.log("The file was saved!");
            }
        });
    }

    writeSuggestionToFile(msg){
        
        suggestions.push({ description: msg });
        const json  = JSON.stringify(suggestions, null, 4);
        fs.writeFile('../assets/suggestions.json', json, 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }else{
                return console.log("The file was saved!");
            }
        });
    }

    writeTimeForTasksToFile(seconds, taskNumber){
        
        responseTimes[taskNumber-1].push(seconds);
        const json  = JSON.stringify(responseTimes, null, 4);
        fs.writeFile('../assets/responseTimes.json', json, 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }else{
                return console.log("The file was saved!");
            }
        });
    }
}

module.exports = new SpotsIO();
