function spawnEmber(color, life, x, y, sx, sy) {
  embers.push(new emberC(color, life, x, y, sx, sy));
}

function spawnRocket(warhead, condition, x, y, sx, sy) {
  rockets.push(new rocketC(warhead, condition, x, y, sx, sy));
}

function spawnNormRocket(warhead, condition, x, y, tx, ty) {
  let [sx, sy] = computeLaunchSpeed(condition, x, y, tx, ty);
  spawnRocket(warhead, condition, x, y, sx, sy);
}

function getVector(angle) {
  return [Math.cos(angle), Math.sin(angle)];
}

function pickRand(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

function computeLaunchSpeed(expCondition, startX, startY, targetX, targetY) {
  let {gravity, airFriction} = phys;
  
  let deltaT = 1/60;
  let guesses = 50;
  
  //if(startY - targetY < 0) return [0, 0];

  let gMin = -10000;
  let gMax = 10000;
  let sy = 0;
  let steps = 0;
  
  for(let i = 0; i < guesses; i++){
    sy = (gMin + gMax) / 2;
    let y;
    [y, steps] = simY(sy);
    
    if(y > targetY){
      gMax = sy;
    }else{
      gMin = sy;
    }
  }
  
  gMin = -10000;
  gMax = 10000;
  let sx = 0;
  
  for(let i = 0; i < guesses; i++){
    sx = (gMin + gMax) / 2;
    let x = simX(sx, steps);
    
    if(x < targetX){
      gMin = sx;
    }else{
      gMax = sx;
    }
  }
  
  return [sx, sy];
  
  function simY(speed) {
    let y = startY;
    
    let steps = 0;
    
    while(!expCondition(speed, steps * deltaT)){
      y += speed * deltaT;
      speed += gravity * deltaT;
      speed *= Math.pow(airFriction, deltaT);
      
      steps++;
      
      if(steps > 99999) break;
    }
    
    return [y, steps];
  }
  
  function simX(speed, steps) {
    let x = startX;
    
    for(let i = 0; i < steps; i++){
      x += speed * deltaT;
      speed *= Math.pow(airFriction, deltaT);
    }
    
    return x;
  }
}

function getMousePos(touch) {  
  let rect = canvas.getBoundingClientRect();

  return [(touch.clientX - rect.left) * (canvas.width / rect.width), (touch.clientY - rect.top) * (canvas.height / rect.height)]
}

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  
  let touch = e.changedTouches[0];
  
  let [x, y] = getMousePos(touch);
  
  spawnNormRocket(
    pickRand([
      explosions.basic,
      explosions.spiked,
      explosions.blank,
      explosions.small,
      explosions.layered,
      explosions.convoluted
    ]),
    phys.CONDITIONS.DEFAULT,
    canvas.width * Math.random(),
    canvas.height,
    x,
    y
  ); 
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  
  let touch = e.changedTouches[0];
  
  let [x, y] = getMousePos(touch);
  
  spawnNormRocket(
    pickRand([
      explosions.basic,
      explosions.spiked,
      explosions.blank,
      explosions.small,
      explosions.layered,
      explosions.convoluted
    ]),
    phys.CONDITIONS.DEFAULT,
    canvas.width * Math.random(),
    canvas.height,
    x,
    y
  ); 
});
