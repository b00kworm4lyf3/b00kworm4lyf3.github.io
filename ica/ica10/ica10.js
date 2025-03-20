let runBtn = document.getElementById('runButton'); //document.querySelector('button'); 
let colBtn = document.getElementById('colorButton');

let xPos = window.innerWidth / 2 - runBtn.offsetWidth / 2;
let yPos = window.innerHeight / 2 - runBtn.offsetHeight / 2;
    
runBtn.style.left = xPos + 'px';
runBtn.style.top = yPos + 'px';

runBtn.addEventListener('mouseover', runAway);
runBtn.addEventListener('click', clicked);
colBtn.addEventListener('click', changeColor);

function changeColor(){
    const newColor = `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;
    const elems = document.querySelectorAll('.colorChange');

    for(const elem of elems){
        elem.style.color = newColor;
    }
}

function runAway(){
    xPos = runBtn.offsetLeft;
    yPos = runBtn.offsetTop;
    // let newHeight = btn.offsetHeight > 20? btn.offsetHeight - 5 : 20;
    // let newWidth = btn.offsetWidth > 80? btn.offsetWidth - 20 : 80;
    let newX = xPos;
    let newY = yPos;
    let num = Math.random();
    
    if(num > 0.65){
        newX += (num * 100);

        if(newX + runBtn.offsetWidth > window.innerWidth){
            newX -= ((num * 100)*2); 
        }
    }
    else{
        newX -= (num * 100);

        if(newX < 0){
            newX += ((num * 100) * 2);
        }
    }

    if(num < 0.65){
        newY += (num * 100);

        if(newY + runBtn.offsetHeight > window.innerHeight){
            newY -= ((num * 100)*2); 
        }
    }
    else{
        newY -= (num * 100);

        if(newY < 0){
            newY += ((num * 100)*2);
        }
    }

    runBtn.style.left = newX + "px";
    runBtn.style.top = newY + "px";
    // btn.style.height = newHeight + "px";
    // btn.style.width = newWidth + "px";
}


function clicked(){
    alert('YOU CLICKED THE BUTTON!');
    location.reload();

    //change size of button and its text
    // btn.style = "padding: 20px; font-size: large";

    // Change doc header
    // let name = document.querySelector('h1');
    // const input = prompt('Enter a new name!');
    // name.textContent = input;   
}