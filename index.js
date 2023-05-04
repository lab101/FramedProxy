const WebSocket = require('ws');


var osc = require("osc");

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    remoteAddress: "255.255.255.255",
    localPort: 3200,
    remotePort: 3000,
    broadcast: true,
    metadata: true
});

const ws = new WebSocket('ws://dot3.lab101.be:6000');

ws.on('error', console.error);

ws.on('open', function open() {
    console.log("ws open");
   // if(ws.readyState == WebSocket.OPEN) ws.send('rr');


});

ws.on('message', function message(data) {

    console.log("received from ws ");
    var oscMessage;

    try {
        oscMessage = osc.readPacket(data,{"metadata": true, "unpackSingleArgs": true});
        console.log(oscMessage);

        udpPort.send(oscMessage);

    } catch (error) {
        console.log("An error occurred: ", error.message);
    }

});


// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg, timeTag, info) {
    console.log("An OSC message just arrived!", oscMsg);
    //console.log("Remote info is: ", info);

    var bin = osc.writePacket(oscMsg,{"metadata": true, "unpackSingleArgs": true});

    if(ws.readyState == WebSocket.OPEN) ws.send(bin);

});

// Open the socket.
udpPort.open();