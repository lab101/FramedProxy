class SideNode{
    constructor(){
        this.id = 0;
        this.siteName = '';
        this.siteGeoLocation = '';
        this.ip = '';
        this.angle = 0;
        this.targetAngle = 0;
        this.position = {x: 0, y: 0};
    }

    draw(ctx,deltaTime){

        this.angle += (this.targetAngle - this.angle) * 0.05;
        this.targetAngle += (deltaTime*0.0001);
        let x = 0 + Math.cos(this.angle) * 150
        let y = 0 + Math.sin(this.angle) * 150
    
        ctx.beginPath()
        ctx.lineWidth = 8
        ctx.arc(x,y,50,0,2*Math.PI)
        ctx.strokeStyle = 'blue'
        ctx.stroke()
       
      }
}

export default SideNode;