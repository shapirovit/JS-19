/* import { mapInit as map } from './js/ymaps';

window.onload = map(); */


var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile('C:/Users/A8-7050/Desktop/JS-project/index.hbs');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});