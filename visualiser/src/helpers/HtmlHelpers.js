

function setDivText(id, text) {
    let div = document.getElementById(id);
    div.innerHTML = text;
    return div;
}


function addDivToDiv(id, childClass) {
    let parentDiv = document.getElementById(id);
    let childDiv = document.createElement("div");
    if (childClass != "") childDiv.classList.add(childClass);
    parentDiv.appendChild(childDiv);
    return childDiv;
}

function addDivToDivWithText(id, childClass, text) {
    let childDiv = addDivToDiv(id, childClass);
    if (text != "") childDiv.innerHTML = text;
    return childDiv;
}

function addClassToDiv(div, className) {
    div.classList.add(className);
}




export { setDivText, addDivToDiv, addDivToDivWithText,addClassToDiv}
