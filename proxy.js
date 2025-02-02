// const WebSocket = require('ws');
// const express = require('express');
import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import { IPinfoWrapper } from "node-ipinfo";
import { lookup } from 'ip-location-api'

//const SiteData = require('./classes/SiteData.js');
import SiteData from './classes/SiteData.js';

const port = process.env.PORT || 6006
const portMonitor = process.env.PORT || 6007


var incomingDataLog = [];
var activeSites = [];

const ipinfoWrapper = new IPinfoWrapper("ffa1d55319e77f");



// create a new websocket server
//const wssMonitor = new WebSocket.Server({ port: portMonitor });
const wssMonitor = new WebSocketServer({ port: portMonitor });

wssMonitor.on('connection', function connection(ws) {  
  sendAllSites();
});

setInterval(function(){
  var site2 = new SiteData();
  site2.id = 2;
  site2.siteName = "test2";
  site2.ip = "109.137.244.226";
  
  ipinfoWrapper.lookupIp(site.ip).then((ipinfo) => {
    site2.siteGeoLocation = ipinfo;
    activeSites.push(site2);
    sendAllSites();
  });

// site2.siteGeoLocation =  lookup(site2.ip);

// activeSites.push(site2);

//   sendAllSites();
}, 10000);

var site = new SiteData();
site.id = 1;
site.ip = "109.137.244.226";
 site.siteGeoLocation =  lookup(site.ip);
activeSites.push(site);



setInterval(function(){
  sendDataToMonitor(0,"send");
}, 4000);


function sendDataToMonitor(siteIndex,action){
  // send clients update to monitor
  wssMonitor.clients.forEach(function each(client) {

    let message = new Object();
    message.action = action;
    message.site = activeSites[siteIndex];
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
      for(var i = 0; i < incomingDataLog.length; i++){
        summerize += "<strong>" + incomingDataLog[i].key + "</strong>  ------  " + incomingDataLog[i].data + "<br/>";
      }
      res.send(summerize  + reloadPage + styleSheet);
  })


  .listen(port, () => console.log(`Listening on port ${port}`));

const wss = new WebSocketServer({ server })





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