
import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import { IPinfoWrapper } from "node-ipinfo";
import { lookup } from 'ip-location-api'
import osc from 'osc';

import SiteData from './classes/SiteData.js';

const port = process.env.PORT || 6006
const portMonitor = process.env.PORT || 6007


var activeSites = [];

const ipinfoWrapper = new IPinfoWrapper("ffa1d55319e77f");


const wssMonitor = new WebSocketServer({ port: portMonitor });

wssMonitor.on('connection', function connection(ws) {  
  sendAllSites();
});




addSite("109.137.244.226");

 
function findSite(ip){
  for(var i = 0; i < activeSites.length; i++){
    if(activeSites[i].ip == ip){
      return activeSites[i];
    }
  }
  return null;
}

 function addSite(ip){
    var site = new SiteData();
    site.ip = ip;
    site.siteGeoLocation =  lookup(site.ip);
    activeSites.push(site);
    sendAllSites();
}

function removeSite(ip){
  for(var i = 0; i < activeSites.length; i++){
    if(activeSites[i].ip == ip){
      activeSites.splice(i,1);
      sendAllSites();
      break;
    }
  }
}


function sendDataToMonitor(ip,action,data){
  // send clients update to monitor
  wssMonitor.clients.forEach(function each(client) {

    let message = new Object();
    message.action = action;
    message.ip = ip;
    message.data = data;
    console.log(JSON.stringify(message));
    client.send(JSON.stringify(message));
  });
}

function sendAllSites(){
  // send clients update to monitor
  wssMonitor.clients.forEach(function each(client) {

    let message = new Object();
    message.action = "all";
    message.sites = activeSites;
    client.send(JSON.stringify(message));
  });
}


// escaped javascript text for reloading the page
var reloadPage = "<script>setTimeout(function(){location.reload()}, 2000);</script>";
// espcaped stylesheet for the page
var styleSheet = "<style>body{font-family: monospace; font-size: 24px;}</style>";


const server = express()
  .use(express.static('public'))
  .get('/', (req, res) => {
  
    res.setHeader('Content-Type', 'text/html');

      var summerize = "<h2>active websockets:</h2>";
      for (let client of wss.clients) {
        summerize += client.realip + "<br/>";
      }
      summerize += "<br/><h2>incoming data:</h2>";
      console.log(activeSites);
      for(var i = 0; i < activeSites.length; i++){
        summerize += "<strong>" + activeSites[i].ip + "</strong>  ------  " + (activeSites[i].dataCount) + "<br/>";
      }
      res.send(summerize  + reloadPage + styleSheet);
  })


  .listen(port, () => console.log(`Listening on port ${port}`));

const wss = new WebSocketServer({ server })

wss.on('connection', function connection(ws,req) {

  console.log('connected ' + req.headers["x-real-ip"]); 

  // get the real ip from the proxy
  ws.realip = req.headers["x-real-ip"];

  ws.on('error', console.error);

  ws.on('close', function close() {
    console.log('disconnected ' + ws.realip);
    removeSite(ws.realip);
  });

  ws.on('message', function message(data, isBinary,req) {

    var adress =  ws.realip;

    const site = findSite(adress);

    let oscMessage = osc.readPacket(data,{"metadata": true, "unpackSingleArgs": true});
    let fwdData = new Object();
    if(oscMessage.address == "/points"){
      console.log(oscMessage.args);
      let r = oscMessage.args[3].value;
      let g = oscMessage.args[4].value;
      let b = oscMessage.args[5].value;

      fwdData[0] = Math.floor(r*255);
      fwdData[1] = Math.floor(g*255);
      fwdData[2] = Math.floor(b*255);
    }

    if(site != null){
      site.dataCount++;
      sendDataToMonitor(adress,"send",fwdData);
    }else{
      addSite(adress);
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
// setInterval(function(){
//   for(var i = 0; i < activeSites.length; i++){
//     var found = false;
//     for (let client of wss.clients) {
//         if(client.realip == activeSites[i].ip){
//           found = true;
//           break;
//         }
//     }
//     if(!found){
//       removeSite(activeSites[i].ip);
//       i--;
//     }
//   }
// }, 60000);














// TEST CODE
//randomSend();


// setTimeout(function(){

//     // ipinfoWrapper.lookupIp(site.ip).then((ipinfo) => {
//   //   site2.siteGeoLocation = ipinfo;
//   //   activeSites.push(site2);
//   //   sendAllSites();
//   // });

//   for(var i = 0; i < rndNr; i++){
//     AddSite(firstIp + ".137.244" + "." + ipLast);
//   }

//   console.log(activeSites.length);
//    sendAllSites();
// }, 4000);





// function randomSend(){

//   if(activeSites.length > 0){
//     let amount = 1 + Math.floor(Math.random() * 50);
//     let rndIndex = Math.floor(Math.random() * activeSites.length);

//     for(var i = 0; i < amount; i++){
//       setTimeout(function(){
//         sendDataToMonitor(activeSites[rndIndex].ip,"send");  
//       }, (i*80) + Math.floor(Math.random() * 800));
  
//     }

//   }
 
//   let sendTimeout = (100 + Math.floor(Math.random() * 4000));

//   setTimeout(function(){

//     randomSend();
//   }, sendTimeout);
// }