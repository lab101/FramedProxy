const WebSocket = require('ws');

const wss = new WebSocket.WebSocketServer({ port: 6000 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    console.log("d " + data);
    console.log(isBinary);

    wss.clients.forEach(function each(client) {
      //client !== ws &&
        if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});