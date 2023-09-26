const WebSocket = require('ws');

const wss = new WebSocket.WebSocketServer({ port: 6000 });

//setup http server
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
server.listen(6001);

var incomingDataLog = [];

// escaped javascript text for reloading the page
var reloadPage = "<script>setTimeout(function(){location.reload()}, 2000);</script>";
// espcaped stylesheet for the page
var styleSheet = "<style>body{font-family: monospace; font-size: 20px;}</style>";

// on incoming http request
app.get('/', (req, res) => {
  var summrize = "active websockets:";
  for (let client of wss.clients) {
      summrize += client._socket.remoteAddress + "<br/>";
  }
  summrize += "<br/>incoming data:<br/>";
  for(var i = 0; i < incomingDataLog.length; i++){
    summrize += "<strong>" + incomingDataLog[i].key + "</strong>  ------  " + incomingDataLog[i].data + "<br/>";
  }
  res.send(summrize  + reloadPage + styleSheet);

});

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  //console.log("d");

  ws.on('message', function message(data, isBinary) {
    //console.log("d " + data);
    //console.log(ws._sender);
    //console.log(isBinary);
    //console.log( "<strong>incoming data: </strong> " + ws._socket.remoteAddress);

    var adress = ws._socket.remoteAddress;
    var foundClient = false;
    for(var i = 0; i < incomingDataLog.length; i++){
      if(incomingDataLog[i].key == adress){
        incomingDataLog[i].data++;
        foundClient = true;
        continue;
      }
    }

    if(!foundClient){
      incomingDataLog.push({key: adress, data: 1});
    }


    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }else{
      }
    });
  });
});