function setupCanvas(canvas,width,height){ 

    if(canvas === undefined){
        console.log("canvas is undefined, creating new one");
        canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
    }

    if(width === undefined){
        width = window.innerWidth;
    }
    if(height === undefined){
        height = window.innerHeight;
    }

    let dpr = window.devicePixelRatio || 1;
    //dpr =1;
    console.log(`dpr: ${dpr}`)

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    let ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Set the "drawn" size of the canvas
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    
    return ctx;
}

function getHeight(){
    return window.innerHeight;
}

function getWidth(){
    return window.innerWidth * ( 1);
}

export { setupCanvas, getHeight, getWidth };