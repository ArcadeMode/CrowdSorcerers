var util = require('util');
var fs = require('fs');
var path = require('path');

var telegram = require('telegram-bot-api');
var api = new telegram({
        token: '823485550:AAEOysLOO9l2fy5npY1t8DQ1GmpRLWHEpYM',
        updates: {
        	enabled: true
    }
});

var conversations = new Map();

var Task1 = require('./tasks/Task1');
var k = new Task1();

// TO BE REMOVED ---------------------------------------------
api.on('message', function(message)
{
	// Received text message
    console.log(message);
});

var filePath = path.join(__dirname, '..', 'assets', 'fucktor.png');

api.sendPhoto({
	chat_id: 12768110,
	caption: 'HALLO IK BEN TERUUUGGGGG',

	// you can also send file_id here as string (as described in telegram bot api documentation)
	photo: filePath
})
.then(function(data)
{
	console.log(util.inspect(data, false, null));
});

api.sendMessage({
	chat_id: 12768110,
	text: 'Ik weet waar je huis woont ;)'
})
.then(function(data)
{
	console.log(util.inspect(data, false, null));
})
.catch(function(err)
{
	console.log(err);
});
// TO BE REMOVED ---------------------------------------------

module.exports = { api: api };
module.exports = { me: api.getMe()};