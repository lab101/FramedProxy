import './style.css'

import SiteNode from './SiteNode.js'
import  { setupCanvas } from './helpers/CanvasHelper.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let lastTime = 0;

setupCanvas(canvas)


let sites = [];

// setup render loop  
const render = () => {
  draw();
  requestAnimationFrame(render)
}


function draw() {

  // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // draw a black background
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(canvas.width/2, canvas.height/2)

    // draw a rectangle
    // ctx.fillStyle = 'red'
    // ctx.fillRect(10,10,100,100)
    // draw a circle

    // // draw a line
    // const endX = 1000;//performance.now() * 0.18% 1400
    // const wave = Math.sin(performance.now() * 0.001) *9

    // ctx.beginPath()
    // ctx.moveTo(200,200)
    // ctx.lineTo(endX,200 + wave * 100)
    // ctx.strokeStyle = 'yellow'
    // ctx.lineWidth = 15
    // // set linecaps to round
    // ctx.lineCap = 'round'
    // // set line dashed
    // ctx.setLineDash([19, 25])

    // ctx.stroke();

    let deltaTime = performance.now() - lastTime;
    lastTime = performance.now();
    for(let i = 0; i < sites.length; i++){
      sites[i].draw(ctx,deltaTime);
    }

    ctx.restore()
}



// connect to websocket
const socketUrl = `ws://${window.location.hostname}:6007`;
var ws = 0;

ws = new WebSocket(socketUrl);
ws.onopen = function() {
  console.log("websocket open!");
};
ws.onclose = function() {
  console.log("websocket closed!");
};
ws.onerror = function(error) {
  console.error(error);
};
ws.onmessage = function(message) {
  console.log("message received");

  console.log(message.data);
  let incomingData = JSON.parse(message.data);

  processPackage(incomingData);
  //console.log(incomingData.action)
  //console.log(incomingData);
};


render()

function existingSite(site){
  for(let i = 0; i < sites.length; i++){
    if(sites[i].id == site.id){
      return true;
    }
  }
  return false;
}

function setAngles(){
  let angleStep = 2 * Math.PI / sites.length;
  for(let i = 0; i < sites.length; i++){
    sites[i].targetAngle = angleStep * i;
  }
}

function addSite(site){
  let newSite = new SiteNode();
  newSite.id = site.id;
  // newSite.siteName = site.siteName;
  // newSite.siteGeoLocation = site.siteGeoLocation;
  newSite.ip = site.ip;
  sites.push(newSite);
  setAngles();
}

function processPackage(data){
  if(data.action == 'all'){
    console.log('add')
    console.log(data.sites)

    for(let i = 0; i < data.sites.length; i++){
      let newSite = data.sites[i];
      // check if new site is already in the list
      let found = existingSite(newSite);
      if(!found){
        addSite(newSite);
      }

    }

  }
}