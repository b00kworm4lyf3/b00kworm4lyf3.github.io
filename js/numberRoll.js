const ball = document.getElementById('ball');
const mazeInner = document.getElementById('mazeInner');
const phoneDisplay = document.getElementById('phoneDisplay');
const resetBtn = document.getElementById('resetBtn');
const deleteBtn = document.getElementById('deleteBtn');
const joystickHandle = document.getElementById('joystickHandle');
const joystickContainer = document.getElementById('joystickContainer');
const enableMotionBtn = document.getElementById('enableMotion');
    
let phoneNumber = '';
let collectedHoles = [];
    
let rotationX = 0;
let rotationY = 0;
let ballX = 20;
let ballY = 20;
let velocityX = 0;
let velocityY = 0;
let isMobile = window.innerWidth <= 1000;
let usingDeviceMotion = false;
let lastTimestamp = 0;
let deltaTime = 0;

const holePositions = [{x: 100, y: 60, num: 1},
                       {x: 250, y: 20, num: 2},
                       {x: 350, y: 80, num: 3},
                       {x: 500, y: 50, num: 4},
                       {x: 180, y: 120, num: 5},
                       {x: 650, y: 160, num: 6},
                       {x: 570, y: 280, num: 7},
                       {x: 120, y: 240, num: 8},
                       {x: 370, y: 180, num: 9},
                       {x: 620, y: 50, num: 0}];

const walls = [{x: 150, y: 40, width: 20, height: 190},
               {x: 325, y: 40, width: 20, height: 200},
               {x: 55, y: 140, width: 90, height: 20},
               {x: 175, y: 170, width: 90, height: 20},
               {x: 450, y: 0, width: 20, height: 60},
               {x: 350, y: 130, width: 100, height: 20},
               {x: 60, y: 0, width: 20, height: 70},
               {x: 560, y: 0, width: 20, height: 150},
               {x: 520, y: 250, width: 20, height: 100},
               {x: 585, y: 130, width: 100, height: 20}];

holePositions.forEach(pos => {
  const hole = document.createElement('div');
  hole.className = 'hole';
  hole.innerText = pos.num;
  hole.style.left = pos.x + 'px';
  hole.style.top = pos.y + 'px';
  hole.dataset.number = pos.num;
  mazeInner.appendChild(hole);
});

walls.forEach(w => {
  const wall = document.createElement('div');
  wall.className = 'wall';
  wall.style.left = w.x + 'px';
  wall.style.top = w.y + 'px';
  wall.style.width = w.width + 'px';
  wall.style.height = w.height + 'px';
  mazeInner.appendChild(wall);
});

let joystickActive = false;
let joystickStartX, joystickStartY;
    
joystickHandle.addEventListener('mousedown', startJoystick);
joystickHandle.addEventListener('touchstart', startJoystick, { passive: false });
    
document.addEventListener('mousemove', moveJoystick);
document.addEventListener('touchmove', moveJoystick, { passive: false });
    
document.addEventListener('mouseup', endJoystick);
document.addEventListener('touchend', endJoystick);
    
function startJoystick(e){
  joystickActive = true;
  joystickHandle.style.animation = 'none';
  joystickHandle.style.cursor = 'grabbing';
      
  if(e.type === 'touchstart'){
    e.preventDefault();
    const touch = e.touches[0];
    joystickStartX = touch.clientX;
    joystickStartY = touch.clientY;
  } 
  else{
    joystickStartX = e.clientX;
    joystickStartY = e.clientY;
  }
}
    
function moveJoystick(e){
  if(!joystickActive){
    return;
  }
      
  let clientX, clientY;
  if(e.type === 'touchmove'){
    e.preventDefault();
    const touch = e.touches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } 
  else{
    clientX = e.clientX;
    clientY = e.clientY;
  }
      
  const rect = joystickContainer.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
      
  let deltaX = clientX - centerX;
  let deltaY = clientY - centerY;
      
  //limit joystick movement to the container radius
  const maxRadius = rect.width / 2 - joystickHandle.offsetWidth / 2;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
  if(distance > maxRadius){
    const angle = Math.atan2(deltaY, deltaX);
    deltaX = Math.cos(angle) * maxRadius;
    deltaY = Math.sin(angle) * maxRadius;
  }
      
  joystickHandle.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
  
  rotationY = (deltaX / maxRadius) * 15; //max 15 degrees
  rotationX = (deltaY / maxRadius) * 15; //max 15 degrees
      
  mazeInner.style.transform = `rotateY(${rotationY}deg) rotateX(${-rotationX}deg)`;
}
    
function endJoystick(){
  if(!joystickActive) return;
      
  joystickActive = false;
  joystickHandle.style.transform = 'translate(-50%, -50%)';
  joystickHandle.style.animation = 'glow 1.5s ease-in-out infinite alternate';
  joystickHandle.style.cursor = 'grab';
}
    
//if on a mobile device, tilt button event listener
enableMotionBtn.addEventListener('click', function(){
  if(typeof DeviceOrientationEvent !== 'undefined' && 
     typeof DeviceOrientationEvent.requestPermission === 'function'){
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if(permissionState === 'granted'){
          usingDeviceMotion = true;
          window.addEventListener('deviceorientation', handleOrientation);
          enableMotionBtn.textContent = "Motion Controls Enabled!";
          enableMotionBtn.disabled = true;
        }
      })
      .catch(console.error);
  } 
  else{
    usingDeviceMotion = true;
    window.addEventListener('deviceorientation', handleOrientation);
    enableMotionBtn.textContent = "Motion Controls Enabled!";
    enableMotionBtn.disabled = true;
  }
});
    
function handleOrientation(event) {
  const beta = event.beta;  //-180 to 180 (front/back)
  const gamma = event.gamma; //-90 to 90 (left/right)
      
  //limit tilt to 15 degrees max
  rotationX = Math.min(Math.max(beta, -15), 15);
  rotationY = Math.min(Math.max(gamma, -15), 15);
      
  mazeInner.style.transform = `rotateY(${rotationY}deg) rotateX(${-rotationX}deg)`;
}

function updateBall(timestamp){
  if(!lastTimestamp){
    lastTimestamp = timestamp;
  }
      
  deltaTime = (timestamp - lastTimestamp) / 16; //normalize to ~60fps
  lastTimestamp = timestamp;
      
  const gravityStrength = 0.2;
  const frictionStrength = 0.05;
  const accelX = rotationY * gravityStrength;
  const accelY = rotationX * gravityStrength;
      
  velocityX += accelX * deltaTime;
  velocityY += accelY * deltaTime;
      
  //friction
  velocityX *= (1 - frictionStrength);
  velocityY *= (1 - frictionStrength);
      
  //max velocity
  const maxVelocity = 4;
  velocityX = Math.max(Math.min(velocityX, maxVelocity), -maxVelocity);
  velocityY = Math.max(Math.min(velocityY, maxVelocity), -maxVelocity);
      
  let newX = ballX + velocityX;
  let newY = ballY + velocityY;
    
  //keep ball in window
  const mazeWidth = mazeInner.clientWidth;
  const mazeHeight = mazeInner.clientHeight;
  const ballSize = ball.offsetWidth;
      
  //wall bouncing
  if(newX < 0){
    newX = 0;
    velocityX = -velocityX * 0.5;
  } 
  else if(newX > mazeWidth - ballSize){
    newX = mazeWidth - ballSize;
    velocityX = -velocityX * 0.5;
  }
      
  if(newY < 0){
    newY = 0;
    velocityY = -velocityY * 0.5;
  } 
  else if(newY > mazeHeight - ballSize){
    newY = mazeHeight - ballSize;
    velocityY = -velocityY * 0.5;
  }
      
  walls.forEach(wall => {
    const ballRect = {
      left: newX,
      top: newY,
      right: newX + ballSize,
      bottom: newY + ballSize
    };
        
    const wallRect = {
      left: parseInt(wall.x),
      top: parseInt(wall.y),
      right: parseInt(wall.x) + parseInt(wall.width),
      bottom: parseInt(wall.y) + parseInt(wall.height)
    };
        
    if (ballRect.right > wallRect.left && 
        ballRect.left < wallRect.right && 
        ballRect.bottom > wallRect.top && 
        ballRect.top < wallRect.bottom){
          
      //shortest way out if ball is inside wall
      const dLeft = ballRect.right - wallRect.left;
      const dRight = wallRect.right - ballRect.left;
      const dTop = ballRect.bottom - wallRect.top;
      const dBottom = wallRect.bottom - ballRect.top;
          
      const min = Math.min(dLeft, dRight, dTop, dBottom);
          
      if(min === dLeft){
        newX = wallRect.left - ballSize;
        velocityX = -velocityX * 0.5;
      } 
      else if(min === dRight){
        newX = wallRect.right;
        velocityX = -velocityX * 0.5;
      } 
      else if(min === dTop){
        newY = wallRect.top - ballSize;
        velocityY = -velocityY * 0.5;
      } 
      else if(min === dBottom){
        newY = wallRect.bottom;
        velocityY = -velocityY * 0.5;
      }
    }
  });
      
  //hole collisions
  holePositions.forEach((hole, index) => {
    const holeX = parseInt(hole.x);
    const holeY = parseInt(hole.y);
    const ballCenterX = newX + ballSize / 2;
    const ballCenterY = newY + ballSize / 2;
        
    const dx = ballCenterX - (holeX + 20); //20 is half hole size
    const dy = ballCenterY - (holeY + 20);
    const distance = Math.sqrt(dx * dx + dy * dy);
        
    if(distance < 20){ //if ball is close enough to hole
      collectDigit(index, hole.num);
          
      //reset ball
      newX = 20;
      newY = 20;
      velocityX = 0;
      velocityY = 0;
    }
  });
      
  ballX = newX;
  ballY = newY;
  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';
      
  requestAnimationFrame(updateBall);
}
    
function collectDigit(holeIndex, digit){
  if (phoneNumber.length >= 10) return;
      
  phoneNumber += digit;
      
  //format
  let formattedNumber = '';
  if(phoneNumber.length > 0){
    formattedNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
      
  phoneDisplay.innerText = formattedNumber || 'Enter your number...';
      
  collectedHoles.push(holeIndex);
  const holeElement = document.querySelectorAll('.hole')[holeIndex];
  holeElement.style.backgroundColor = '#009900';
      
  //add flash animation
  const animation = document.createElement('div');
  animation.style.position = 'absolute';
  animation.style.width = '50px';
  animation.style.height = '50px';
  animation.style.backgroundColor = '#FFFF00';
  animation.style.borderRadius = '50%';
  animation.style.opacity = '0.7';
  animation.style.left = holeElement.style.left;
  animation.style.top = holeElement.style.top;
  animation.style.zIndex = '5';
  mazeInner.appendChild(animation);
      
  //animate
  let size = 50;
  let opacity = 0.7;
  const animInterval = setInterval(() => {
    size += 10;
    opacity -= 0.1;
    animation.style.width = size + 'px';
    animation.style.height = size + 'px';
    animation.style.marginLeft = -((size - 40) / 2) + 'px';
    animation.style.marginTop = -((size - 40) / 2) + 'px';
    animation.style.opacity = opacity;
        
    if(opacity <= 0){
      clearInterval(animInterval);
      mazeInner.removeChild(animation);
    }
  }, 50);
      
  if(phoneNumber.length === 10){
    setTimeout(() => {
      alert('Congratulations! You completed your phone number: ' + formattedNumber);
    }, 500);
  }
}
    
resetBtn.addEventListener('click', function() {
  phoneNumber = '';
  phoneDisplay.innerText = 'Enter your number...';
  ballX = 20;
  ballY = 20;
  velocityX = 0;
  velocityY = 0;
  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';
      
  document.querySelectorAll('.hole').forEach((hole, index) => {
    if (collectedHoles.includes(index)) {
      hole.style.backgroundColor = '#000033';
    }
  });
  collectedHoles = [];
});
    
deleteBtn.addEventListener('click', function() {
  if (phoneNumber.length > 0) {
    phoneNumber = phoneNumber.slice(0, -1);
        
    let formattedNumber = '';
    if(phoneNumber.length > 0){
      formattedNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
        
    phoneDisplay.innerText = formattedNumber || 'Enter your number...';
        
    if(collectedHoles.length > 0){
      const lastIndex = collectedHoles.pop();
      document.querySelectorAll('.hole')[lastIndex].style.backgroundColor = '#000033';
    }
  }
});
    
requestAnimationFrame(updateBall);
