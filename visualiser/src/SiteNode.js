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

        this.lineCount = 0;
        this.circleCount = 0;
        this.rectangleCount = 0;

        let smallerside = Math.min(getWidth(),getHeight());
        this.radius = smallerside * 0.3;
        this.dataCount = 0;

        this.timeOffset = Math.random() * 20;
        this.sendingCounter = 0;

        this.color = "#FFFFFF"

        this.sendList = [];

        this.colorCountDictonary = {};

      //  this.fakeSend();

    }

    fakeSend(){
        let color =[Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255)];

        let amount = 1 + Math.floor(Math.random() * 150);

        for(let i = 0; i < amount; i++){
            setTimeout(() => {
            this.sending(color);
            }, i * 10);
        }

        let rndTime = 1000 + Math.random() * 20000;
        setTimeout(() => {
            this.fakeSend();    
        }, rndTime);

    }


    formatCount(count){
        if(count > 1000000){
            return Math.floor(count / 1000000) + "M";
        }else if(count > 1000){
            return Math.floor(count / 1000) + "K";
        }else{
            return count;
        }
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

        ctx.fillText(this.formatCount(this.lineCount),x +80,y-13);
        ctx.fillText(this.formatCount(this.circleCount),x +80,y+0);
        ctx.fillText(this.formatCount(this.rectangleCount),x +80,y+13);

        ctx.fillStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x + 65,y,4,4,0,0,2 * Math.PI);

        ctx.rect(x + 62,y +10,6,6);

        // draw line
        ctx.moveTo(x + 61,y-14);
        ctx.lineTo(x + 67,y-10);

        ctx.stroke();


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
        const margin = 16;
        const rndDistance = -margin + Math.random() * (margin*2);
        this.sendList.push([0,rndSpeed,color,rndDistance]);

      }

      
}

export default SideNode;