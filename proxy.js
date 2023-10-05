const WebSocket = require('ws');
const express = require('express');


const port = process.env.PORT || 6006


var incomingDataLog = [];

// escaped javascript text for reloading the page
var reloadPage = "<script>setTimeout(function(){location.reload()}, 2000);</script>";
// espcaped stylesheet for the page
var styleSheet = "<style>body{font-family: monospace; font-size: 20px;}</style>";


const server = express()
  .use(express.static('public'))
  .get('/', (req, res) => {
  
    res.setHeader('Content-Type', 'text/html');

      var summrize = "active websockets:";
      for (let client of wss.clients) {
          summrize += client._socket.remoteAddress + "<br/>";
      }
      summrize += "<br/>incoming data:<br/>";
      for(var i = 0; i < incomingDataLog.length; i++){
        summrize += "<strong>" + incomingDataLog[i].key + "</strong>  ------  " + incomingDataLog[i].data + "<br/>";
      }
      res.send(summrize  + reloadPage + styleSheet);
  })


  .listen(port, () => console.log(`Listening on port ${port}`));

const wss = new WebSocket.Server({ server })





wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  //console.log("d");

  ws.on('message', function message(data, isBinary) {


    //var adress = ws._socket.remoteAddress;

    var adress = ws._socket.headers['X-Real-IP'] || ws._socket.connection.remoteAddress;


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