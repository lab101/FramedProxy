import { getHeight, getWidth } from "./helpers/CanvasHelper";

class SideNode{
    constructor(){
        this.id = 0;
        this.siteName = '';
        this.siteGeoLocation = '';
        this.ip = '';
        this.angle = 0;
        this.targetAngle = 0;
        this.position = {x: 0, y: 0};

        let smallerside = Math.min(getWidth(),getHeight());
        this.radius = smallerside * 0.3;
        this.dataCount = 0;

        this.timeOffset = Math.random() * 20;
        this.sendingCounter = 0;

        this.color = "#FFFFFF"

        this.sendList = [];

    }

    draw(ctx,deltaTime){

        this.angle += (this.targetAngle - this.angle) * 0.05;
        this.targetAngle += (deltaTime*0.0001);


        let radius = this.radius + Math.sin((performance.now()) * 0.0008 + this.timeOffset) * 50;

        let x = 0 + Math.cos(this.angle) * radius
        let y = 0 + Math.sin(this.angle) * radius

        this.position.x = x;
        this.position.y = y;
    
        ctx.beginPath()
        ctx.lineWidth = 6
        ctx.arc(x,y,50,0,2 * Math.PI)

        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.8;
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.strokeStyle =  this.color;
        ctx.stroke()
       
        // draw textInfo
        ctx.font = "20px sans-serif";
        ctx.fillStyle = 'white';
        // center text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.siteGeoLocation,x,y-10);

        ctx.font = "8px sans-serif";
        ctx.fillText(this.ip,x,y+16);


        for(let i = 0; i < this.sendList.length; i++){
            const speed = this.sendList[i][1];
            this.sendList[i][0] += deltaTime * speed * 0.001;
            if(this.sendList[i][0] > 1){
                this.sendList.splice(i,1);
            }
        }
      }

      sending(color){
        const rndSpeed = 0.2 + Math.random() * 0.2;
        this.sendList.push([0,rndSpeed,color]);

      }
}

export default SideNode;