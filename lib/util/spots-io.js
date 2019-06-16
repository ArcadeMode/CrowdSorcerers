const jsonspots = require("../../assets/location-data/studyspots-building28.json");
const Update = require("../location-data/update");
const fs = require('fs');
const suggestions = require("../../assets/suggestions.json");
const responseTimes = require("../../assets/responseTimes.json");

class SpotsIO {

    getSpots() {
        if(!this.spots) {
            const StudySpot = require("../location-data/study-spot");
            this.spots = jsonspots.map(spot => new StudySpot(spot));
        }
        return this.spots;
    }

    updateSpot(studyspot) {
        const studyspots = this.spots.map(spot => spot.description === studyspot.description && spot.floor === studyspot.floor
            ? studyspot : spot);
        const json  = JSON.stringify(studyspots, null, 4);
        fs.writeFile('../assets/location-data/studyspots-building28.json', json, 'utf8', function(err) {
            if(err) {
                console.error(err);
            }else{
                console.log("The file was saved!");
            }
        });
    }

    writeSuggestionToFile(msg){
        
        suggestions.push({ description: msg });
        const json  = JSON.stringify(suggestions, null, 4);
        fs.writeFile('../assets/suggestions.json', json, 'utf8', function(err) {
            if(err) {
                console.error(err);
            }else{
                console.log("The file was saved!");
            }
        });
    }

    writeTimeForTasksToFile(seconds, taskNumber){
        
        responseTimes[taskNumber-1].push(seconds);
        const json  = JSON.stringify(responseTimes, null, 4);
        fs.writeFile('../assets/responseTimes.json', json, 'utf8', function(err) {
            if(err) {
                console.error(err);
            }else{
                console.log("The file was saved!");
            }
        });
    }
}

module.exports = new SpotsIO();
