const spots = require("../../assets/locationData/studyspots-building28");

class NearbySpots {
    static calculate(api, message) {
        if (!message.location) {
            return;
        }

        const lat = message.location.latitude;
        const long = message.location.longitude;
        let dist = 0;
        let bestDist = 50;
        let bestSpot = "Not found";
        spots.spots.forEach(function (spot) {
            dist = Math.sqrt((spot.lng - long) ** 2 + (spot.lat - lat) ** 2);
            if (dist < bestDist) {
                bestDist = dist;
                bestSpot = spot;
            }
        });

        api.sendMessage({chat_id: message.chat.id, text: bestSpot.desc + ", at floor " + bestSpot["floor"]})
    }
}

module.exports = NearbySpots;