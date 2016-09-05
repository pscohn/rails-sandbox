var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('client/static'));

var rooms = {};
var nicks = {};

var addNickToRoom = function(nick, room) {
  if (!nicks[room]) {
    nicks[room] = [nick];
    return;
  }
  nicks[room].push(nick);
}

var setupRoom = function(room) {
  if (rooms[room] === true || room === '__webpack_hmr') {
    return;
  }
  var nsp = io.of('/' + room);
  nsp.on('connection', function(socket) {
    console.log('a user connected to ' + room);
    nsp.emit('nicks', nicks[room] || []);
    socket.on('disconnect', function() {
      console.log('user disconnected from ' + room);
    });
    socket.on('chat message', function(msg) {
      nsp.emit('chat message', msg);
    });
    socket.on('nick set', function(nick) {
      addNickToRoom(nick, room);
      nsp.emit('nicks', nicks[room]);
    });
  });
  rooms[room] = true;
}

app.get('/:room', function(req, res) {
  setupRoom(req.params.room);
  res.sendFile(__dirname + '/client/static/index.html');
});


http.listen(3000, function() {
  console.log('listening on *:3000');
});
