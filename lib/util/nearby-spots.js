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

        let spotsWithDistances = [];
        spots.forEach(function (spot) {
            spot.dist = NearbySpots.GeoDistMeters(spot.latitude, spot.longitude, lat, long) + (Math.max(Math.abs(spot.floor - floorNumber), 1) * distanceBetweenFloors);
            spot.updates = spot.updates.filter(u => (new Date(u.timestamp).getTime() / 60000 + 30) > (new Date().getTime() / 60000));
            //TODO REMOVE CONSOLE LOG
            console.log(spot.toString() + " DIST --> " + spot.dist);
            if(spot.dist < 20) { //only keep track of close ones to given location
                spotsWithDistances.push(spot);
            }
        });

        return spotsWithDistances
            .sort(NearbySpots.updateCountSortFunction)
            .map(spot => new StudySpot(spot));
    }

    //Method to fetch nearest study locations
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
            //TODO CHANGE TO MATH.POW (** is ES7)
            dist = Math.sqrt((spot.longitude - long) ** 2 + (spot.latitude - lat) ** 2 + distanceBetweenFloors * (spot.floor - floorNumber) ** 2);
            spot.dist = dist;
            spotsWithDistances.push(spot);
        });

        return spotsWithDistances
            .sort(NearbySpots.distSortFunction)
            .map(spot => new StudySpot(spot)).slice(0,3);
    }

    //Gets the best study location considering occupation
    static getBestSpots(location, floorNumber) {
        if (!location) {
            return [];
        }
        const spots = SpotsIO.getSpots();
        const lat = location.latitude;
        const long = location.longitude;
        let spotsWithDistances = [];
        spots.forEach(function (spot) {
            spot.dist = NearbySpots.GeoDistMeters(spot.latitude, spot.longitude, lat, long) + (Math.max(Math.abs(spot.floor - floorNumber), 1) * distanceBetweenFloors);
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
            .sort(NearbySpots.occupationSortFunction)
            .slice(0,3)
            .map(spot => new StudySpot(spot));
    }

    static distSortFunction(a, b) {
        if (a.dist < b.dist) {
            return 1;
        } else {
            return -1;
        }
    }

    static updateCountSortFunction(a, b) {
        if (a.updates ? a.updates.length : 0 < b.updates ? b.updates.length : 0) {
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

    static GeoDistMeters(lat1, lon1, lat2, lon2){  // generally used geo measurement function
        const R = 6378.137; // Radius of earth in KM
        const dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
        const dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c;
        //TODO REMOVE CONSOLE LOG
        console.log("GeoDist Says " + d*1000);
        return d * 1000; // meters
    }
}

module.exports = NearbySpots;