var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

io.on('connection', function(socket){
    socket.on('event', function(data){

    });
    socket.on('disconnect', function(){

    });
});

server.listen(3000);