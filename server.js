
// var io = require('socket.io')(http);
// const io = require('socket.io-client')('http://localhost:8080');

var app = require('express')();
var http = require('http').createServer(app);
// var io = require('socket.io')(http);
const io = require('socket.io-client')('http://localhost:8080');
let persons = {};
let allClients = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('authorization', function(person){

    persons[person.login] = {
      name: person.name,
      id: person.id,
      foto: person.foto
    };

    allClients.push(person.name);
    io.emit('plus', allClients);
  });

  socket.on('disconnect', function() {
    console.log('a user disconnected');
    for (let some in persons) {
      if (persons[some].id === socket.id) {
        let index = allClients.indexOf(persons[some].name);
        allClients.splice(index, 1);
        break;
      }
    }
    io.emit('minus', allClients);
  });

  socket.on('load foto', function(fotoSrc) {
    console.log('a user load foto');
    for (let some in persons) {
      if (persons[some].id === socket.id) {
        persons[some].foto = fotoSrc;        
        break;
      }
    }
    console.log('socket.id');
    console.log('fotoSrc');
    io.emit('update foto', socket.id, fotoSrc);
  });

  /* socket.emit('load foto', placeDropFoto.src); */
  

  socket.on('chat message', function(time, msg) {
    let foto;
    let name;
    for (let some in persons) {
      if (persons[some].id === socket.id) {
        foto = persons[some].foto;
        name = persons[some].name;
        break;
      }
    }

    io.emit('chat message', socket.id, foto, name, time, msg);
  });

});

http.listen(8080, function(){
  console.log('listening on *:8080');
});