var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let persons = {};
let allClients = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index1.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('authorization', function(person){    
    console.log('authorization from socket.id=', socket.id);

    if (persons[person.login]) {

        if (persons[person.login].historyMessage.length > 0) {
            let msgArr = persons[person.login].historyMessage;

            for (let i = 0; i < msgArr.length; i++) {
                for (let some in persons) {
                    console.log('persons[some].idClient=', persons[some].idClient);
                    console.log('msgArr[i].idClient=', msgArr[i].idClient);
                    console.log('persons[some].idClient === msgArr[i].idClient)=', (persons[some].idClient === msgArr[i].idClient));
                    if (persons[some].idClient === msgArr[i].idClient) {
                        msgArr[i].foto = persons[some].foto;
                        msgArr[i].name = persons[some].name;
                    }
                }              
            }
            persons[person.login].historyMessage = msgArr;


            io.emit('history', person.id, msgArr );
        }
        
        persons[person.login].oldName = persons[person.login].name;
        persons[person.login].name = person.name;
        console.log('persons[person.login].id=', persons[person.login].id);
        persons[person.login].oldId = persons[person.login].id;
        persons[person.login].id = person.id;
        persons[person.login].online = true;
        let id = person.id;
        let oldId = persons[person.login].oldId;        
        let idClient = persons[person.login].idClient;
        let foto = persons[person.login].foto;
        let name = person.name;
        let oldName = persons[person.login].oldName;
        console.log('id=', id);   
        console.log('oldId=', oldId);
        console.log('name=', name);
        console.log('oldName=', oldName);

        io.emit('updateData', id, oldId, idClient, name, oldName, foto);

    } else {
      persons[person.login] = {
        name: person.name,
        id: person.id,
        idClient: person.idClient,
        foto: person.foto,
        online: person.online,
        historyMessage: []
      };
      console.log('person.id=', person.id);
    }
    console.log('personsAfter persons[person.login] name and id=', persons[person.login].name, persons[person.login].id);

    allClients.push(person.name);
    io.emit('plus', allClients);
  });

  socket.on('disconnect', function() {
    console.log('a user disconnected');
    for (let some in persons) {
      if (persons[some].id === socket.id) {
        persons[some].online = false;
        let index = allClients.indexOf(persons[some].name);
        allClients.splice(index, 1);        
      }
    }
    io.emit('minus', allClients);
  });

  socket.on('load foto', function(id, fotoSrc) {
    console.log('a user load foto');
    for (let some in persons) {
      if (persons[some].id === id) {
        persons[some].foto = fotoSrc;
      }
    }
    console.log('for load foto id=', id);
    io.emit('update foto', id, fotoSrc);
  });

  /* socket.emit('load foto', placeDropFoto.src); */
  

  socket.on('chat message', function(id, time, msg) {
    console.log('chat message from socket.id and id=', socket.id, id);
    let foto;
    let name;
    let idClient;

    for (let some in persons) {
      if (persons[some].id === id) {
        foto = persons[some].foto;
        name = persons[some].name;
        idClient = persons[some].idClient;
      }
    }
    for (let some in persons) {
      if (persons[some].online) {
        persons[some].historyMessage.push({
          id: id,
          idClient: idClient,
          foto: foto,
          name: name,
          time: time,
          msg: msg
        });
      }
    }

    console.log('on chat message id=', id);
    console.log('on chat message idClient=', idClient);
    console.log('on chat message name=', name);
    console.log('on chat message time=', time);
    console.log('on chat message msg=', msg);
    
    io.emit('chat message', id, idClient, foto, name, time, msg);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});