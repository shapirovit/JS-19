/* import { mapInit as map } from './js/ymaps';

window.onload = map(); */


var app = require('express')();
var http = require('http').createServer(app);

app.get('/', function(req, res){
  res.sendFile('C:\Users\A8-7050\Desktop\JS-project\index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});