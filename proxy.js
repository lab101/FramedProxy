const WebSocket = require('ws');
const express = require('express');


const port = process.env.PORT || 6006


var incomingDataLog = [];

// escaped javascript text for reloading the page
var reloadPage = "<script>setTimeout(function(){location.reload()}, 2000);</script>";
// espcaped stylesheet for the page
var styleSheet = "<style>body{font-family: monospace; font-size: 24px;}</style>";


const server = express()
  .use(express.static('public'))
  .get('/', (req, res) => {
  
    res.setHeader('Content-Type', 'text/html');

      var summrize = "<h2>active websockets:</h2>";
      for (let client of wss.clients) {
          summrize += client.realip + "<br/>";
      }
      summrize += "<br/><h2>incoming data:</h2>";
      for(var i = 0; i < incomingDataLog.length; i++){
        summrize += "<strong>" + incomingDataLog[i].key + "</strong>  ------  " + incomingDataLog[i].data + "<br/>";
      }
      res.send(summrize  + reloadPage + styleSheet);
  })


  .listen(port, () => console.log(`Listening on port ${port}`));

const wss = new WebSocket.Server({ server })





wss.on('connection', function connection(ws,req) {


  // get the real ip from the proxy
  ws.realip = req.headers["x-real-ip"];

  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary,req) {

    var adress =  ws.realip;

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


// clear non active clients from incomingDataLog
setInterval(function(){
  for(var i = 0; i < incomingDataLog.length; i++){
    var found = false;
    for (let client of wss.clients) {
        if(client.realip == incomingDataLog[i].key){
          found = true;
          break;
        }
    }
    if(!found){
      incomingDataLog.splice(i,1);
      i--;
    }
  }
}, 1000);