import WebSocket, { WebSocketServer } from 'ws';
import osc from 'osc';
import os from 'os';

var localIps = [];

// set your socket url here
var socketUrl = "ws://framedproxy.lab101.be";


// check local ip
var net_int = os.networkInterfaces();
var no_of_network_interfaces = 0;

for (var key in net_int) {
    var net_infos=net_int[key];
       
    net_infos.forEach(element => {      
    no_of_network_interfaces++;
    
      for (var attr in element){
        if(attr == "address"){
            localIps.push(element[attr]);
            console.log("local ips: " + element[attr]);
        }
      }
    });  
  }
  


var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    remoteAddress: "255.255.255.255",
    localPort: 3000,
    remotePort: 3000,
    broadcast: true,
    metadata: true
});

var ws = 0;
var timer = 0;

function tryConnect(){


    if(ws!=0 && ws.readyState == WebSocket.OPEN){
        // connection is good
        console.log("connection is good not trying to reconnect");
        timer = 0;

        return;
    }

    try{
        console.log("trying to connect to websocket");

        ws = 0;
        ws = new WebSocket(socketUrl);
        setupCallbacks();

        // ws.on('error', function error(msg){
        //     console.log('\x1b[31m%s\x1b[0m', msg)
        // } );


    }catch(error){

    }


    timer = setTimeout(() => {
        tryConnect();
    }, 5000);
}

function setupCallbacks(){

    ws.on('error', console.error);

    ws.on('open', function open() {
        console.log("websocket open!");
    });
    
    ws.on('close', function close() {
        console.log("websocket closed!");
        if(timer==0) tryConnect();
    });
    
    ws.on('message', function message(data) {
    
        var oscMessage;
    
        try {
            oscMessage = osc.readPacket(data,{"metadata": true, "unpackSingleArgs": true});
            //console.log(oscMessage);
            console.log('\x1b[34m%s\x1b[0m', 'Incoming remote websocket message ' + oscMessage.address);
    
            udpPort.send(oscMessage);
    
        } catch (error) {
            console.log("An error occurred: ", error.message);
        }
    
    });
}



// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg, timeTag, info) {
//    console.log("Remote info is: ", info);

    // block broadcast messages which where send from this machine
    if(localIps.includes(info.address)){
        //console.log("block bounced broadcast message " + info.address);
    }else{
        console.log('\x1b[32m%s\x1b[0m', "incoming osc from " + info.address + " - " + oscMsg.address);
        var bin = osc.writePacket(oscMsg,{"metadata": true, "unpackSingleArgs": true});
    
        if(ws.readyState == WebSocket.OPEN) ws.send(bin);
    
    }

});

// Open the socket.
udpPort.open();

tryConnect();