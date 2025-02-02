function getHSLString(h,s,l){
    return `hsl(${h},${s}%,${l}%)`;
}

function getRGBString(r,g,b){
    return `rgb(${r},${g},${b})`;
}   

export {getHSLString,getRGBString};