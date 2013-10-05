var redis = require('redis');

var client = redis.createClient();

var createLog = function(){

	var getHistory = function(){
		client.lrange('messages', function(err, messages){
			console.log(messages);
		});
	};

	var logMessage = function(message){
		var messageJson = JSON.stringify(message);
		client.lpush('messages', messageJson);
	};

	return {
		getHistory:getHistory,
		logMessage:logMessage
	};
}

exports.createLog = createLog;