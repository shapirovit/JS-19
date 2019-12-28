var socket = io();

function submit() {
    var socket = io();
    let input = document.querySelector('#m');
    let button = document.querySelector('button');
    button.addEventListener('click', e => {
        e.preventDefault();
        console.log('input.value=', input.value);
        socket.emit('chat message', input.value);
        input.value = '';
        return false;
    });
    socket.on('chat message', msg => {
        let message = document.querySelector('#message');
        let li = document.createElement('li');
        li.textContent = msg;
        message.append(li);
    });
};
submit();








/////////////////////////////////////////////


/* var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index1.html');
}); */

/* io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  }); */

/* io.on('connection', function(socket){
    socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    });
}); */

/* io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
}); */

/* var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index1.html');
});

io.on('connection', function(socket) {
    socket.on('chatMessage', function(msg){
        io.emit('chatMessage', msg);
    });
}); */
/* io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
      });
}); */

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });

/* var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index1.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
}); */