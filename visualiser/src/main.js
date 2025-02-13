import './style.css'

import SiteNode from './SiteNode.js'
import  { getHeight, getWidth, setupCanvas } from './helpers/CanvasHelper.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let lastTime = 0;

setupCanvas(canvas)


let sites = [];
let colors = ['#0000FF','#00a564','#ed1c25','#ff6e00','#6dcff6','#f7ec0f','#ccbcff','#ff00ff','#7e3a20'];
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
    ctx.translate(getWidth()/2, getHeight()/2)


    let deltaTime = performance.now() - lastTime;
    deltaTime = Math.min(deltaTime, 1.0/30.0 * 1000);

    lastTime = performance.now();
    for(let i = 0; i < sites.length; i++){


      ctx.setLineDash([40, 10])
      ctx.strokeStyle = sites[i].color;
      ctx.lineWidth = 2
      ctx.lineCap = 'round'


      if(sites[i].sendList.length > 0){

          drawDataLines(i,ctx,deltaTime);
        
      }

    }
    ctx.globalAlpha = 1;

    for(let i = 0; i < sites.length; i++){
      ctx.setLineDash([]);
      sites[i].draw(ctx,deltaTime);
    }

    ctx.restore()
}


  function drawDataLines(i,ctx,deltaTime){

    const marginAroundCircle = 60;
    for(let j = 0; j < sites.length; j++){
      if(i != j){
        ctx.beginPath();

        

        let angle = Math.atan2(sites[j].position.y - sites[i].position.y, sites[j].position.x - sites[i].position.x);
        let x = sites[i].position.x + Math.cos(angle) * marginAroundCircle;
        let y = sites[i].position.y + Math.sin(angle) * marginAroundCircle;

        let x2 = sites[j].position.x - Math.cos(angle) * marginAroundCircle;
        let y2 = sites[j].position.y - Math.sin(angle) * marginAroundCircle;

        ctx.moveTo(x,y);
        ctx.lineTo(x2,y2);
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1;

        for(let k = 0; k < sites[i].sendList.length; k++){
          let time = sites[i].sendList[k][0];
          let color = sites[i].sendList[k][2];

          let x3 = x + (x2 - x) * time;
          let y3 = y + (y2 - y) * time;

          // calculate perpindicular line
          let perpAngle = angle + Math.PI/2;
          let offset = sites[i].sendList[k][3];

          let x4 = x3 + Math.cos(perpAngle) * offset;
          let y4 = y3 + Math.sin(perpAngle) * offset;


          //ctx.beginPath();
          //ctx.ellipse(x4,y4,1,1,0,0,2 * Math.PI);
          ctx.fillRect(x4,y4,2,2);
          if(color){
            ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
          }

         // ctx.fill();

        }
        ctx.globalAlpha = 1;


      }
    }
  }


// connect to websocket
//const socketUrl = `ws://${window.location.hostname}:6007`;
const socketUrl = `ws://framedproxy.lab101.be/monitor`;
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
      return sites[i];
    }
  }
  return null;
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


function updateSite(existingSite, newSite){

  existingSite.ip = newSite.ip;
  existingSite.lineCount = newSite.lineCount;
  existingSite.circleCount = newSite.circleCount;
  existingSite.rectangleCount = newSite.rectangleCount;

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
      let incomingSite = data.sites[i];
      // check if new site is already in the list
      let foundSite = existingSite(incomingSite);
      if(!foundSite){
        addSite(incomingSite);
      }else{
        updateSite(foundSite,incomingSite);
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