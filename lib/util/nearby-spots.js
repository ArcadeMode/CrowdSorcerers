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
                    if ((new Date(update.timestamp).getTime() / 60000 + 30) > (new Date().getTime() / 60000)) {
                        stillValidUpdates++;
                    }
                });
                if(stillValidUpdates === 0) {
                    spotsWithUpdateRequired.push(item);
                }
            }
        });

        return spotsWithUpdateRequired
            .sort(NearbySpots.distSortFunction)
            .map(spot => new StudySpot(spot));
    }

    //TODO write method to fetch nearest study locations
    static getnearestslocation(longitude, latitude, floorNumber) {
        if (!longitude && !latitude) {
            return [];
        }

        const spots = SpotsIO.getSpots();
        const lat = latitude;
        const long = longitude;
        let dist = Number.MAX_VALUE;

        let spotsWithDistances = [];
        spots.forEach(function (spot) {
            dist = Math.sqrt((spot.lng - long) ** 2 + (spot.lat - lat) ** 2 + distanceBetweenFloors * (spot.floorNumber - floorNumber) ** 2);
            spot.dist = dist;
            spotsWithDistances.push(spot);
        });

        return spotsWithDistances
            .sort(NearbySpots.distSortFunction)
            .map(spot => new StudySpot(spot)).slice(0,3);
    }

    //TODO rename to something describing that it gets the best study location considering occupation
    static getBestSpots(location, floorNumber) {
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
                    if ((new Date(update.timestamp).getTime() / 60000 + 30) > (new Date().getTime() / 60000)) {
                        item.mostRecentOccupations.push(update.seatsAvailable / item.capacity);
                    }
                });
                if (item.mostRecentOccupations.length > 0) {
                    let keep = true;
                    item.mostRecentOccupations.forEach(function (percentage) {
                        if (percentage >= 0.9) {
                            keep = false;
                        }
                    });
                    if (keep) {
                        goodSpots.push(item);
                    }
                }
            }
        });
        return goodSpots.sort(NearbySpots.distSortFunction)
            .slice(0,3)
            .sort(NearbySpots.occupationSortFunction)
            .map(spot => new StudySpot(spot));
    }

    static distSortFunction(a, b) {
        if (a.dist < b.dist) {
            return 1;
        } else {
            return -1;
        }
    }

    static occupationSortFunction(a, b) {
        let sumA = 0;
        a.mostRecentOccupations.forEach(function (percentage) {
            sumA += percentage;
        });
        let sumB = 0;
        b.mostRecentOccupations.forEach(function (percentage) {
            sumB += percentage;
        });
        let scoreA = sumA / a.mostRecentOccupations.length;
        let scoreB = sumB / b.mostRecentOccupations.length;
        if (scoreA >= 0.7 || scoreB >= 0.7) {
            if (scoreA < scoreB) {
                return 1;
            } else {
                return -1;
            }
        }
    }
}

module.exports = NearbySpots;