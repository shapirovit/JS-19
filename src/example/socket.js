var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let count = 0;
let persons = {};
let allClients = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index1.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('authorization', function(person){
    console.log('personsBefore=', persons);

    persons[person.login] = {
      name: person.name,
      id: person.id,
      foto: person.foto
    };
    console.log('personsAfter=', persons);

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

    io.emit('chat message', foto, name, time, msg);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});