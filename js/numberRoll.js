document.addEventListener('DOMContentLoaded', function() {
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
let isMobile = window.innerWidth <= 768;
let usingDeviceMotion = false;
let lastTimestamp = 0;
let deltaTime = 0;
    
// Create numbered holes (one for each digit 0-9)
const holePositions = [{x: 50, y: 50, num: 1},
                       {x: 200, y: 60, num: 2},
                       {x: 350, y: 70, num: 3},
                       {x: 100, y: 150, num: 4},
                       {x: 250, y: 140, num: 5},
                       {x: 400, y: 160, num: 6},
                       {x: 70, y: 230, num: 7},
                       {x: 220, y: 240, num: 8},
                       {x: 370, y: 220, num: 9},
                       {x: 500, y: 150, num: 0}];
    
// Create obstacles
const obstacles = [{x: 150, y: 40, width: 20, height: 120},
                   {x: 300, y: 100, width: 20, height: 140},
                   {x: 30, y: 100, width: 100, height: 20},
                   {x: 180, y: 180, width: 140, height: 20},
                   {x: 400, y: 60, width: 20, height: 80},
                   {x: 450, y: 220, width: 100, height: 20},
                   {x: 320, y: 20, width: 20, height: 60}];
    
// Create holes
holePositions.forEach(pos => {
    const hole = document.createElement('div');
    hole.className = 'hole';
    hole.innerText = pos.num;
    hole.style.left = pos.x + 'px';
    hole.style.top = pos.y + 'px';
    hole.dataset.number = pos.num;
    mazeInner.appendChild(hole);});
    
// Create obstacles
obstacles.forEach(obs => {
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.left = obs.x + 'px';
    obstacle.style.top = obs.y + 'px';
    obstacle.style.width = obs.width + 'px';
    obstacle.style.height = obs.height + 'px';
    mazeInner.appendChild(obstacle);});
    
// Set up joystick mechanics
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
    
function moveJoystick(e) {
    if (!joystickActive) return;
      
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
      
    // Limit joystick movement to the container radius
    const maxRadius = rect.width / 2 - joystickHandle.offsetWidth / 2;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
    if(distance > maxRadius){
        const angle = Math.atan2(deltaY, deltaX);
        deltaX = Math.cos(angle) * maxRadius;
        deltaY = Math.sin(angle) * maxRadius;
    }
      
    joystickHandle.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
      
    // Calculate rotation based on joystick position
    rotationY = (deltaX / maxRadius) * 15; // max 15 degrees
    rotationX = (deltaY / maxRadius) * 15; // max 15 degrees
      
    mazeInner.style.transform = `rotateY(${rotationY}deg) rotateX(${-rotationX}deg)`;
}
    
function endJoystick(){
      if(!joystickActive) return;
      
      joystickActive = false;
      joystickHandle.style.transform = 'translate(-50%, -50%)';
      joystickHandle.style.animation = 'glow 1.5s ease-in-out infinite alternate';
      joystickHandle.style.cursor = 'grab';
}
    
// Setup device orientation for mobile
enableMotionBtn.addEventListener('click', function(){
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function'){
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              usingDeviceMotion = true;
              window.addEventListener('deviceorientation', handleOrientation);
              enableMotionBtn.textContent = "Motion Controls Enabled!";
              enableMotionBtn.disabled = true;
            }
          })
          .catch(console.error);
      } else {
        usingDeviceMotion = true;
        window.addEventListener('deviceorientation', handleOrientation);
        enableMotionBtn.textContent = "Motion Controls Enabled!";
        enableMotionBtn.disabled = true;
      }
    });
    
    function handleOrientation(event) {
      const beta = event.beta;  // -180 to 180 (front/back)
      const gamma = event.gamma; // -90 to 90 (left/right)
      
      // Limit tilt to 15 degrees max
      rotationX = Math.min(Math.max(beta, -15), 15);
      rotationY = Math.min(Math.max(gamma, -15), 15);
      
      mazeInner.style.transform = `rotateY(${rotationY}deg) rotateX(${-rotationX}deg)`;
}
    
// Ball physics
function updateBall(timestamp){
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }
      
      deltaTime = (timestamp - lastTimestamp) / 16; // normalize to ~60fps
      lastTimestamp = timestamp;
      
      // Apply gravity based on rotation
      const gravityStrength = 0.2;
      const frictionStrength = 0.05;
      
      // Calculate acceleration based on tilt
      const accelX = rotationY * gravityStrength;
      const accelY = rotationX * gravityStrength;
      
      // Apply acceleration to velocity
      velocityX += accelX * deltaTime;
      velocityY += accelY * deltaTime;
      
      // Apply friction
      velocityX *= (1 - frictionStrength);
      velocityY *= (1 - frictionStrength);
      
      // Cap max velocity
      const maxVelocity = 5;
      velocityX = Math.max(Math.min(velocityX, maxVelocity), -maxVelocity);
      velocityY = Math.max(Math.min(velocityY, maxVelocity), -maxVelocity);
      
      // Update position
      let newX = ballX + velocityX;
      let newY = ballY + velocityY;
      
      // Check wall collisions
      const mazeWidth = mazeInner.clientWidth;
      const mazeHeight = mazeInner.clientHeight;
      const ballSize = ball.offsetWidth;
      
      // Wall bouncing
      if (newX < 0) {
        newX = 0;
        velocityX = -velocityX * 0.5; // bounce with energy loss
      } else if (newX > mazeWidth - ballSize) {
        newX = mazeWidth - ballSize;
        velocityX = -velocityX * 0.5;
      }
      
      if (newY < 0) {
        newY = 0;
        velocityY = -velocityY * 0.5;
      } else if (newY > mazeHeight - ballSize) {
        newY = mazeHeight - ballSize;
        velocityY = -velocityY * 0.5;
      }
      
      // Check obstacle collisions
      obstacles.forEach(obs => {
        const ballRect = {
          left: newX,
          top: newY,
          right: newX + ballSize,
          bottom: newY + ballSize
        };
        
        const obsRect = {
          left: parseInt(obs.x),
          top: parseInt(obs.y),
          right: parseInt(obs.x) + parseInt(obs.width),
          bottom: parseInt(obs.y) + parseInt(obs.height)
        };
        
        if (ballRect.right > obsRect.left && 
            ballRect.left < obsRect.right && 
            ballRect.bottom > obsRect.top && 
            ballRect.top < obsRect.bottom) {
          
          // Find shortest way out
          const dLeft = ballRect.right - obsRect.left;
          const dRight = obsRect.right - ballRect.left;
          const dTop = ballRect.bottom - obsRect.top;
          const dBottom = obsRect.bottom - ballRect.top;
          
          const min = Math.min(dLeft, dRight, dTop, dBottom);
          
          if (min === dLeft) {
            newX = obsRect.left - ballSize;
            velocityX = -velocityX * 0.5;
          } else if (min === dRight) {
            newX = obsRect.right;
            velocityX = -velocityX * 0.5;
          } else if (min === dTop) {
            newY = obsRect.top - ballSize;
            velocityY = -velocityY * 0.5;
          } else if (min === dBottom) {
            newY = obsRect.bottom;
            velocityY = -velocityY * 0.5;
          }
        }
      });
      
      // Check hole collisions
      holePositions.forEach((hole, index) => {
        // if (collectedHoles.includes(index)) return;
        
        const holeX = parseInt(hole.x);
        const holeY = parseInt(hole.y);
        const ballCenterX = newX + ballSize / 2;
        const ballCenterY = newY + ballSize / 2;
        
        const dx = ballCenterX - (holeX + 20); // 20 is half hole size
        const dy = ballCenterY - (holeY + 20);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 20) { // If ball is close enough to hole
          collectDigit(index, hole.num);
          
          // Reset ball position
          newX = 20;
          newY = 20;
          velocityX = 0;
          velocityY = 0;
        }
      });
      
      // Update ball position
      ballX = newX;
      ballY = newY;
      ball.style.left = ballX + 'px';
      ball.style.top = ballY + 'px';
      
      requestAnimationFrame(updateBall);
    }
    
    function collectDigit(holeIndex, digit) {
      if (phoneNumber.length >= 10) return;
      
      phoneNumber += digit;
      
      // Format the phone number
      let formattedNumber = '';
      if (phoneNumber.length > 0) {
        formattedNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      }
      
      phoneDisplay.innerText = formattedNumber || 'Enter your number...';
      
      // Mark hole as collected
      collectedHoles.push(holeIndex);
      const holeElement = document.querySelectorAll('.hole')[holeIndex];
      holeElement.style.backgroundColor = '#009900';
      
      // Create a simple animation effect
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
      
      // Animate and remove
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
        
        if (opacity <= 0) {
          clearInterval(animInterval);
          mazeInner.removeChild(animation);
        }
      }, 50);
      
      // Check if phone number is complete
      if (phoneNumber.length === 10) {
        setTimeout(() => {
          alert('Congratulations! You completed your phone number: ' + formattedNumber);
        }, 500);
      }
    }
    
    // Reset button
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
    
    // Delete button
    deleteBtn.addEventListener('click', function() {
      if (phoneNumber.length > 0) {
        phoneNumber = phoneNumber.slice(0, -1);
        
        let formattedNumber = '';
        if (phoneNumber.length > 0) {
          formattedNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        }
        
        phoneDisplay.innerText = formattedNumber || 'Enter your number...';
        
        // Reset the last collected hole
        if (collectedHoles.length > 0) {
          const lastIndex = collectedHoles.pop();
          document.querySelectorAll('.hole')[lastIndex].style.backgroundColor = '#000033';
        }
      }
    });
    
    // Start the game loop
    requestAnimationFrame(updateBall);
  });