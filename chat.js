var _ = require('underscore');
var roster = require('./roster');
var chatlog = require('./chatlog');

var log = chatlog.createLog();

var createChatApp = function(io){

    var chatRoster = roster();

	return function(client){
		var chatEvents = {
			join:function(data){
				var nickname = data.name;
				client.set('nickname', nickname);
				var message = {message:"".concat(nickname, " joined the chat"), type:"status"};
				client.broadcast.emit('status', message);
				chatRoster.addMember(nickname);
				io.sockets.emit('roster', chatRoster.getMembers());

				var loggedMessages = log.getHistory(function(loggedMessages){
					client.emit('catchup', loggedMessages);
				});

			},

			disconnect:function(){
				client.get("nickname", function(err, nickname){
					var message = {message:"".concat(nickname, " has left the chat"), type:"status"};
					//log.logMessage(message);
					client.broadcast.emit('status', message);
					chatRoster.removeMember(nickname);
					io.sockets.emit('roster', chatRoster.getMembers());
				});
			},

			'chatto': function(data){
				client.get('nickname', function(err, name){
					var message = {name:name, message:data, timestamp : +new Date()};
					io.sockets.emit('chatfrom', message);
					log.logMessage(message);

				});

			}
		};

		_.functions(chatEvents).forEach(function(evnt){
			client.on(evnt, chatEvents[evnt]);
		});
	}
}

exports.createChatApp = createChatApp;