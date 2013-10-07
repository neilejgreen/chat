var redis = require('redis');

var createLog = function(maxlength){

	maxlength = maxlength | 100;
	var client = redis.createClient();

	var getHistory = function(callback){
		client.lrange('messages', 0, -1, function(err, messages){
			var sortedMessages = 
				messages
				.map(JSON.parse)
				.sort(function(l, r){
					return l.timestamp - r.timestamp;
				});
			callback(sortedMessages);
		});
	};

	var logMessage = function(message){
		var messageJson = JSON.stringify(message);
		client.lpush('messages', messageJson, function(err, newLength){
			client.ltrim('messages', 0, maxlength -1 );
		});
	};

	return {
		getHistory:getHistory,
		logMessage:logMessage,
		close : function(){client.quit();}
	};
}

exports.createLog = createLog;