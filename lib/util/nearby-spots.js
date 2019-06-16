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
        spots.forEach(spot => {
            spot.dist = NearbySpots.GeoDistMeters(spot.latitude, spot.longitude, lat, long) + (Math.abs(spot.floor - floorNumber) * distanceBetweenFloors);
            spot.updates = spot.updates.filter(u => (new Date(u.timestamp).getTime() / 60000 + 30) > (new Date().getTime() / 60000));
            if(spot.dist < 20) {
                // only keep track of close ones to given location
                // 20 meters was evaluated by hand and appears a good fit for building 28
                spotsWithDistances.push(spot);
            }
        });

        return spotsWithDistances
            .sort(NearbySpots.updateCountSortFunction)
            .map(NearbySpots.clearTemporaryProperties);
    }

    //Method to fetch nearest study locations
    static getnearestslocation(longitude, latitude, floorNumber) {
        if (!longitude && !latitude) {
            return [];
        }

        const spots = SpotsIO.getSpots();
        const lat = latitude;
        const long = longitude;

        let spotsWithDistances = spots.map(spot => {
            spot.dist = NearbySpots.GeoDistMeters(spot.latitude, spot.longitude, lat, long) + (Math.abs(spot.floor - floorNumber) * (distanceBetweenFloors*3));//weigh floor distance heavier here, shits weird
            return spot;
        });

        return spotsWithDistances
            .sort(NearbySpots.distSortFunction)
            .map(NearbySpots.clearTemporaryProperties)
            .slice(0,3);
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
        spots.forEach(spot => {
            spot.dist = NearbySpots.GeoDistMeters(spot.latitude, spot.longitude, lat, long) + (Math.abs(spot.floor - floorNumber) * (distanceBetweenFloors*3));
            spotsWithDistances.push(spot);
        });

        let goodSpots = [];
        spotsWithDistances.forEach(item => {
            item.updates = item.updates.filter(update => (new Date(update.timestamp).getTime() / 60000 + 30) > (new Date().getTime() / 60000));
            if (item.updates && item.updates.length > 0) {
                //two counters to calculate average occupation percentage of updates
                let occupationTotal = 0;
                let occupationCount = 0;
                item.updates.forEach(update => {
                    occupationTotal += (item.capacity - update.seatsAvailable) / item.capacity;
                    occupationCount++;
                });
                item.avgOccupationReported = occupationTotal/occupationCount;
                if (item.avgOccupationReported < 0.9) {
                    // only keep spot when average occupation reported is less than 90%
                    goodSpots.push(item);
                }
            } else { /*no updates..*/ }
        });
        return goodSpots
            .sort(NearbySpots.occupationAndDistSortFunction)
            .map(NearbySpots.clearTemporaryProperties)
            .slice(0,3);
    }

    static distSortFunction(a, b) {
        return Math.round(a.dist - b.dist);
    }

    static updateCountSortFunction(a, b) {
        if (a.updates ? a.updates.length : 0 < b.updates ? b.updates.length : 0) {
            return 1;
        } else {
            return -1;
        }
    }

    static occupationAndDistSortFunction(a, b) {
        return Math.round(a.dist - b.dist);
    }

    static clearTemporaryProperties(spot) {
        delete spot.dist;
        delete spot.avgOccupationReported;
        return spot;
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
        return d * 1000; // meters
    }
}

module.exports = NearbySpots;