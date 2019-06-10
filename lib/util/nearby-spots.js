let spots = require("../../assets/location-data/studyspots-building28");
const distanceBetweenFloors = 4; //Describes how many meters should be taken into account when calculating the distance
// between floors.

class NearbySpots {

    static findInNeedOfUpdate(location, floorNumber) {
        if(!location) {
            return;
        }

        const lat = location.latitude;
        const long = location.longitude;
        let dist = Number.MAX_VALUE;

        spots.spots.forEach(function (spot) {
            dist = Math.sqrt((spot.lng - long) ** 2 + (spot.lat - lat) ** 2 + distanceBetweenFloors * (spot.floorNumber - floorNumber) ** 2);
            spot.dist = dist;
        });

        let spotsWithUpdateRequired = [];
        spots.forEach(function (item) {
            if (item.updates && item.updates.length > 0) {
                let stillValidUpdates = 0;
                item.updates.forEach(function (update) {
                    if ((new Date(update.timestamp).getMinutes() + 30) < new Date()) {
                        stillValidUpdates++;
                    }
                });
                if(stillValidUpdates === 0) {
                    spotsWithUpdateRequired.push(item);
                }
            }
        });

        return spotsWithUpdateRequired.sort(function (a, b) {
            if (a.dist < b.dist) {
                return 1;
            } else {
                return -1;
            }
        });
    }

    static calculate(location, floorNumber) {
        if (!location) {
            return;
        }

        const lat = location.latitude;
        const long = location.longitude;
        let dist = Number.MAX_VALUE;

        spots.spots.forEach(function (spot) {
            dist = Math.sqrt((spot.lng - long) ** 2 + (spot.lat - lat) ** 2 + distanceBetweenFloors * (spot.floorNumber - floorNumber) ** 2);
            spot.dist = dist;
        });

        let goodSpots = [];
        spots.forEach(function (item) {
            if (item.updates && item.updates.length > 0) {
                item.mostRecentOccupations = [];
                item.updates.forEach(function (update) {
                    if ((new Date(update.timestamp).getMinutes() + 30) < new Date()) {
                        item.mostRecentOccupations.push(update.seatsAvailable / item.capacity);
                    }
                });
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
        });

        return goodSpots.sort(function (a, b) {
            if (a.dist < b.dist) {
                return 1;
            } else {
                return -1;
            }
        });

    }
}

module.exports = NearbySpots;