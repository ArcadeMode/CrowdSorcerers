const StudySpot = require("../location-data/study-spot");

const SpotsIO = require("./spots-io");
const distanceBetweenFloors = 4; //Describes how many meters should be taken into account when calculating the distance
// between floors.

class NearbySpots {

    static findInNeedOfUpdate(location, floorNumber) {
        if(!location) {
            return;
        }
        const spots = SpotsIO.getSpots();
        const lat = location.latitude;
        const long = location.longitude;
        let dist = Number.MAX_VALUE;

        let spotsWithDistances = [];
        spots.forEach(function (spot) {
            dist = Math.sqrt((spot.lng - long) ** 2 + (spot.lat - lat) ** 2 + distanceBetweenFloors * (spot.floorNumber - floorNumber) ** 2);
            spot.dist = dist;
            spotsWithDistances.push(spot);
        });

        let spotsWithUpdateRequired = [];
        spotsWithDistances.forEach(function (item) {
            if (item.updates && item.updates.length > 0) {
                let stillValidUpdates = 0;
                item.updates.forEach(function (update) {
                    if ((new Date(update.timestamp).getTime() / 60000) > (new Date().getTime() / 60000 - 30)) {
                        stillValidUpdates++;
                    }
                });
                if(stillValidUpdates === 0) {
                    spotsWithUpdateRequired.push(item);
                }
            }
        });

        return spotsWithUpdateRequired
            .sort(NearbySpots.spotSortfunction)
            .map(spot => new StudySpot(spot));
    }

    //TODO write method to fetch nearest study locations
    static crazyMethod() {

    }

    //TODO rename to something describing that it gets the best study location considering occupation
    static calculate(location, floorNumber) {
        if (!location) {
            return [];
        }

        const spots = SpotsIO.getSpots();
        const lat = location.latitude;
        const long = location.longitude;
        let dist = Number.MAX_VALUE;

        let spotsWithDistances = [];
        spots.forEach(function (spot) {
            dist = Math.sqrt((spot.lng - long) ** 2 + (spot.lat - lat) ** 2 + distanceBetweenFloors * (spot.floorNumber - floorNumber) ** 2);
            spot.dist = dist;
            spotsWithDistances.push(spot);
        });

        let goodSpots = [];
        spotsWithDistances.forEach(function (item) {
            if (item.updates && item.updates.length > 0) {
                item.mostRecentOccupations = [];
                item.updates.forEach(function (update) {
                    if ((new Date(update.timestamp).getTime() / 60000) > (new Date().getTime() / 60000 - 30)) {
                        item.mostRecentOccupations.push(update.seatsAvailable / item.capacity);
                    }
                });
                if (item.mostRecentOccupations) {
                    let keep = true;
                    item.mostRecentOccupations.forEach(function (percentage) {
                        if (percentage >= 0.8) {
                            keep = false;
                        }
                    });
                    if (keep) {
                        goodSpots.push(item);
                    }
                }
            }
        });
        return goodSpots
            .sort(NearbySpots.spotSortfunction)
            .map(spot => new StudySpot(spot));
    }

    static spotSortfunction(a, b) {
        if (a.dist < b.dist) {
            return 1;
        } else {
            return -1;
        }
    }
}

module.exports = NearbySpots;