var log = require('./chatlog').createLog();


log.logMessage({name:'Test', message:'BOOM!', timestamp : + new Date()});


log.getHistory(function(messages){
	console.log(messages.length, "messages");
	messages
	.forEach(function(message){
		console.log(''.concat(message.name, ' said ', message.message, ' at ', new Date(message.timestamp)));
	});
});

setTimeout(function(){log.close()}, 100);
