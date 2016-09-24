var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');

app.use(express.static('client/static'));

var rooms = {};
var nicks = {};
var colors = {}

var addNickToRoom = function(nick, room, color) {
  colors[nick] = color;
  if (!nicks[room]) {
    nicks[room] = [nick];
    return;
  }
  nicks[room].push(nick);
}

var removeNickFromRoom = function(nick, room) {
  var index = nicks[room].indexOf(nick);
  if (index === -1) {
    return;
  }
  nicks[room].splice(index, 1);
}

var setupRoom = function(room) {
  if (rooms[room] === true || room === '__webpack_hmr') {
    return;
  }
  var nsp = io.of('/' + room);
  nsp.on('connection', function(socket) {
    nsp.emit('nicks', nicks[room] || [], colors);
    socket.on('disconnect', function() {
      console.log('user disconnected from ' + room);
    });
    socket.on('chat message', function(msg) {
      nsp.emit('chat message', msg);
    });
    socket.on('nick set', function(nick) {
      var color = crypto.createHash('md5').update(nick).digest("hex").slice(0, 6);
      addNickToRoom(nick, room, color);
      nsp.emit('nicks', nicks[room], colors);
      nsp.emit('nick joined', nick, color);
    });
    socket.on('user left', function(nick) {
      removeNickFromRoom(nick, room);
      nsp.emit('nicks', nicks[room], colors);
      nsp.emit('nick left', nick);
    });
  });
  rooms[room] = true;
}

app.get('/:room', function(req, res) {
  setupRoom(req.params.room);
  res.sendFile(__dirname + '/client/static/index.html');
});

var PORT = process.env.PORT || 4000;
http.listen(PORT, function() {
  console.log('listening on *:4000');
});
