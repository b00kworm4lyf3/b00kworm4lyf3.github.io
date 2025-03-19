let btn = document.getElementById('button'); //document.querySelector('button'); 

let xPos = window.innerWidth / 2 - btn.offsetWidth / 2;
let yPos = window.innerHeight / 2 - btn.offsetHeight / 2;
    
btn.style.left = xPos + 'px';
btn.style.top = yPos + 'px';

btn.addEventListener('mouseover', runAway);
btn.addEventListener('click', clicked);

function runAway(){
    xPos = btn.offsetLeft;
    yPos = btn.offsetTop;
    // let newHeight = btn.offsetHeight > 20? btn.offsetHeight - 5 : 20;
    // let newWidth = btn.offsetWidth > 80? btn.offsetWidth - 20 : 80;
    let newX = xPos;
    let newY = yPos;
    let num = Math.random();
    
    if(num > 0.5){
        newX += (num * 50);

        if(newX + btn.offsetWidth > window.innerWidth){
            newX -= ((num * 50)*2); 
        }
    }
    else{
        newX -= (num * 50);

        if(newX < 0){
            newX (num * 100);
        }
    }

    if(num < 0.5){
        newY += 20;

        if(newY + btn.offsetHeight > window.innerHeight){
            newY -= 40; 
        }
    }
    else{
        newY -= 20;

        if(newY < 0){
            newY += 40;
        }
    }
    

    btn.style.left = newX + "px";
    btn.style.top = newY + "px";
    // btn.style.height = newHeight + "px";
    // btn.style.width = newWidth + "px";
}


function clicked(){
    alert('YOU CLICKED TO BUTTON!');
    location.reload();

    //change size of button and its text
    // btn.style = "padding: 20px; font-size: large";

    // Change doc header
    // let name = document.querySelector('h1');
    // const input = prompt('Enter a new name!');
    // name.textContent = input;   
}