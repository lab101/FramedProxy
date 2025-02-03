import './style.css'

import SiteNode from './SiteNode.js'
import  { setupCanvas } from './helpers/CanvasHelper.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let lastTime = 0;

setupCanvas(canvas)


let sites = [];
let colors = ['#00E0AA','#E0A900','#009CE0','#E07800','#2E708B','#E306155'];
let colorIndex = 0;

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


    // ctx.stroke();

    let deltaTime = performance.now() - lastTime;
    lastTime = performance.now();
    for(let i = 0; i < sites.length; i++){


      ctx.setLineDash([40, 10])
      ctx.strokeStyle = sites[i].color;
      ctx.lineWidth = 2
      ctx.lineCap = 'round'


      if(sites[i].sendList.length > 0){

        for(let j = 0; j < sites.length; j++){
          if(i != j){
            ctx.beginPath();

            let angle = Math.atan2(sites[j].position.y - sites[i].position.y, sites[j].position.x - sites[i].position.x);
            let x = sites[i].position.x + Math.cos(angle) * 60;
            let y = sites[i].position.y + Math.sin(angle) * 60;

            let x2 = sites[j].position.x - Math.cos(angle) * 60;
            let y2 = sites[j].position.y - Math.sin(angle) * 60;

            ctx.moveTo(x,y);
            ctx.lineTo(x2,y2);
            ctx.globalAlpha = 0.2;
            ctx.stroke();
            ctx.globalAlpha = 1;

            for(let k = 0; k < sites[i].sendList.length; k++){
              let t = sites[i].sendList[k][0];
              let color = sites[i].sendList[k][2];
              console.log(color);
              let x3 = x + (x2 - x) * t;
              let y3 = y + (y2 - y) * t;
              ctx.beginPath();
              ctx.ellipse(x3,y3,2,2,0,0,2 * Math.PI);
              if(color){
                ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
                console.log("rgb(" + color[0] + "," + color[1] + "," + color[2] + ")");
              }

              ctx.globalAlpha = 1;//sites[i].sendList[k][1] * 2;
              ctx.fill();

            }


            // ctx.moveTo(x,y);
            // ctx.lineTo(x2,y2);
            // ctx.stroke()
          }
        }
        
      }

    }
    ctx.globalAlpha = 1;

    for(let i = 0; i < sites.length; i++){
      ctx.setLineDash([]);
      sites[i].draw(ctx,deltaTime);
    }

    ctx.restore()
}



// connect to websocket
//const socketUrl = `ws://${window.location.hostname}:6007`;
const socketUrl = `ws://framedproxy.lab101.be:6007`;
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

  let incomingData = JSON.parse(message.data);
  processPackage(incomingData);
};


render()

function existingSite(site){
  for(let i = 0; i < sites.length; i++){
    if(sites[i].ip == site.ip){
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

  console.log('adding site')
  console.log(site)

  let newSite = new SiteNode();
  newSite.id = site.id;
  // newSite.siteName = site.siteName;
  newSite.siteGeoLocation = site.siteGeoLocation.country;
  newSite.ip = site.ip;
  newSite.color = colors[colorIndex];
  colorIndex++;
  if(colorIndex >= colors.length){
    colorIndex = 0;
  }
  sites.push(newSite);
  setAngles();
}



function getNodeByIp(ip){
  for(let i = 0; i < sites.length; i++){
    if(sites[i].ip == ip){
      return sites[i];
    }
  }
  return null;
}


function sendDataFromNode(data){

  let node = getNodeByIp(data.ip);
  if(node){
    console.log('sending from node')
    node.sending(data.data);
  }
}


function processPackage(data){
  if(data.action == 'all'){
 
    for(let i = 0; i < data.sites.length; i++){
      let newSite = data.sites[i];
      // check if new site is already in the list
      let found = existingSite(newSite);
      if(!found){
        addSite(newSite);
      }
    }

    // check if any sites are removed
    for(let i = 0; i < sites.length; i++){
      let found = false;
      for(let j = 0; j < data.sites.length; j++){
        if(sites[i].ip == data.sites[j].ip){
          found = true;
          break;
        }
      }

      if(!found){
        sites.splice(i,1);
        setAngles();
      }
    }

  }


  else if(data.action == 'send'){
    console.log('send')
    console.log(data.ip)
    console.log(data.data)
    sendDataFromNode(data);
  }

}