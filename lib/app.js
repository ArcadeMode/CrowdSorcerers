var telegram = require('telegram-bot-api');

var api = new telegram({
        token: '823485550:AAEOysLOO9l2fy5npY1t8DQ1GmpRLWHEpYM',
        updates: {
        	enabled: true
    }
});

api.getMe()
.then(function(data)
{
    console.log(data);
})
.catch(function(err)
{
	console.log(err);
});

api.on('message', function(message)
{
	// Received text message
    console.log(message);
});

api.sendPhoto({
	chat_id: 12768110,
	caption: 'HOMO JOOD',

	// you can also send file_id here as string (as described in telegram bot api documentation)
	photo: 'AndGayMing.jpg'
})
.then(function(data)
{
	console.log(util.inspect(data, false, null));
});