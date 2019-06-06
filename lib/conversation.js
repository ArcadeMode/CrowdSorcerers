// Import API
var api = require('./app').api;
var Task1 = require('./tasks/Task1');

class Conversation {


    // Init Conversation object
    constructor(){
        // Init coins
        this.coins = 0;

        // Active Task
        this.activeTask = Task1;

        // Init preferred buildings
        this.preferedBuildings = []

        // Init preferred times
        this.preferedTimes = []



    }


}