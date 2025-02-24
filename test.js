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
            console.log('\x1b[34m%s\x1b[0m', 'Incoming remote message');
    
            console.log("Remote message is: ", oscMessage);


            udpPort.send(oscMessage);
    
        } catch (error) {
            console.log("An error occurred: ", error.message);
        }
    
    });
}



// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg, timeTag, info) {
    //console.log("An OSC message just arrived!", oscMsg);
    console.log("Remote info is: ", info);

    if(localIps.includes(info.address)){
        console.log("block bounced broadcast message");
    }else{
        console.log('\x1b[32m%s\x1b[0m', "incoming osc from " + info.address + " - " + oscMsg.address);
        var bin = osc.writePacket(oscMsg,{"metadata": true, "unpackSingleArgs": true});
    
        if(ws.readyState == WebSocket.OPEN) ws.send(bin);
    
    }

});

// Open the socket.
udpPort.open();

tryConnect();


function HSB2RGB(h,s,b){
    h = h % 360;
    s = Math.max(0, Math.min(1, s));
    b = Math.max(0, Math.min(1, b));
    let c = b * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = b - c;
    let r, g, bl;
    if (h < 60) {
        r = c;
        g = x;
        bl = 0;
    } else if (h < 120) {
        r = x;
        g = c;
        bl = 0;
    } else if (h < 180) {
        r = 0;
        g = c;
        bl = x;
    } else if (h < 240) {
        r = 0;
        g = x;
        bl = c;
    } else if (h < 300) {
        r = x;
        g = 0;
        bl = c;
    } else {
        r = c;
        g = 0;
        bl = x;
    }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((bl + m) * 255)];
}

let xPos = 0;
let yPos = 200;
let red = 0;
let green = 0;
let blue = 0;

let hue = 0;
let sat = 50;
let brightness = 50;

let angle = 0;
let radius = 1080/2;
let time=0;
let frameId = 0;

setInterval(() => {
    if(ws!=0 && ws.readyState == WebSocket.OPEN){
        // send osc message
        xPos += 20;
        angle += 0.2;
      

        hue = 30 + (Math.sin(time*0.1)) * 40;
        hue = hue % 360;
        time += 0.01;

        brightness = Math.abs(Math.sin(time*0.1)) * 100;
        
        radius = Math.abs(Math.sin(time*0.04)) * 1080/2;
        radius = Math.round(radius/10)*10;



       // let frameId = Math.abs(Math.sin(time*4)) * 24;
        frameId+=1;
        if(frameId>24) frameId = 0;

        let rgb = HSB2RGB(hue,sat,brightness);
        red = rgb[0]/255;
        green = rgb[1]/255;
        blue = rgb[2]/255;
       

        var msg = {
            address: "/points",
            args: [
                {
                    type: "i", // group id
                    value: "1"
                },
                {
                    type: "i", // frame id
                    value: frameId
                },
                {
                    type: "F", // eraser on
                    value: "0"
                },
                {
                    type: "f", // color r
                    value: red
                },
                {
                    type: "f", // color g
                    value: green
                },
                {
                    type: "f", // color b
                    value: blue
                },
                
            ]
        };

        for(var i = 0; i < 80; i++){

            let tmpAngle = angle + i * 0.04;
            let x = 1920/2 + Math.cos(tmpAngle) * radius;
            let y = 1080/2 + Math.sin(tmpAngle) * radius;

            msg.args.push({
                type: "f",
                value: x,
            });
            msg.args.push({
                type: "f",
                value: y,
            });
            msg.args.push({
                type: "f",
                value: 10,
            });
        }

        var bin = osc.writePacket(msg,{"metadata": true, "unpackSingleArgs": true});
        ws.send(bin);
       
    }else{
    }
}, 100);



let angle2 = 0;
let time2 = 0;

setInterval(() => {
    if(ws!=0 && ws.readyState == WebSocket.OPEN){
        // send osc message
        angle2 = angle;
      
        //time += 0.01;

        radius = Math.abs(Math.sin(time*0.01)) * 1080/2;
        radius = Math.round(radius/10)*10;


        let frameId = Math.abs(Math.sin((time+20)*4)) * 24;
       

        var msg = {
            address: "/points",
            args: [
                {
                    type: "i", // group id
                    value: "1"
                },
                {
                    type: "i", // frame id
                    value: frameId
                },
                {
                    type: "F", // eraser on
                    value: "0"
                },
                {
                    type: "f", // color r
                    value: 0
                },
                {
                    type: "f", // color g
                    value: 0
                },
                {
                    type: "f", // color b
                    value: 0
                },
                
            ]
        };

        for(var i = 0; i < 40; i++){

            let tmpAngle = angle2 + i * 0.02;
            let x = 1920/2 + Math.cos(tmpAngle) * radius;
            let y = 1080/2 + Math.sin(tmpAngle) * radius;

            msg.args.push({
                type: "f",
                value: x,
            });
            msg.args.push({
                type: "f",
                value: y,
            });
            msg.args.push({
                type: "f",
                value: 20,
            });
        }

        var bin = osc.writePacket(msg,{"metadata": true, "unpackSingleArgs": true});
        ws.send(bin);
       
    }else{
    }
}, 4000);