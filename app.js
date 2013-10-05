var express = require('express');
var socket = require('socket.io');
var fs = require('fs');
var http = require('http');
var chat = require('./chat');


var app = express();
app.get('/', function(q,s){
	fs.createReadStream('./index.html').pipe(s);
});

var server = http.createServer(app);
var io = socket.listen(server);
var chatApp = chat.createChatApp(io);

io.sockets.on('connection', chatApp);

server.listen(8080);
