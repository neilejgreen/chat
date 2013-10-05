var _ = require('underscore');
var roster = require('./roster');
var messagelog = require('./messagelog');

var log = messagelog.createLog();

var createChatApp = function(io){

    var chatRoster = roster();

	return function(client){
		var chatEvents = {
			join:function(data){
				var nickname = data.name;
				client.set('nickname', nickname);
				client.broadcast.emit('status', {message:"".concat(nickname, " joined the chat")});
				chatRoster.addMember(nickname);
				io.sockets.emit('roster', chatRoster.getMembers());

				var loggedMessages = log.getHistory();
				client.emit('catchup', loggedMessages);
			},

			disconnect:function(){
				client.get("nickname", function(err, nickname){
					client.broadcast.emit('status', {message:"".concat(nickname, " has left the chat")});
					chatRoster.removeMember(nickname);
					io.sockets.emit('roster', chatRoster.getMembers());
				});
			},

			'chatto': function(data){


				client.get('nickname', function(err, name){
					var message = {name:name, message:data};
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