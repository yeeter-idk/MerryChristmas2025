let explosions = {
  basic: function(x, y, strength = 40, time = 1) {
    let color = pickRand(graphics.COLORS);
    for(let i = 0; i < 500; i++){
      let [dx, dy] = getVector(Math.random() * TAU);
      
      let force = strength * (1 - Math.random() ** 2);
      
      dx *= force;
      dy *= force;
      
      spawnEmber(color, time + Math.random(), x, y, dx, dy);
    }
    
    rocketExplodeSFX.volume(0.6);
    rocketExplodeSFX.rate(Math.random() * 0.2 + 0.6);
    rocketExplodeSFX.play();
  },
  spiked: function(x, y) {
    let protrusions = Math.floor(5 * Math.random()) + 3;
    let rotOffset = TAU * Math.random();
    let color = pickRand(graphics.COLORS);
    
    for(let i = 0; i < protrusions; i++){
      let angle = (i / protrusions) * TAU + rotOffset;
      
      for(let j = 0; j < 100; j++){
        let angleOffset = Math.random() ** 5;
        let force = 50 * (1 - angleOffset) * Math.random();
        angleOffset *= Math.random() < 0.5 ? -0.5 : 0.5;
        
        let [dx, dy] = getVector(angle + angleOffset);
        
        dx *= force;
        dy *= force;
        
        spawnEmber(color, 1.5 + Math.random(), x, y, dx, dy);
      }
    }
    
    rocketExplodeSFX.volume(0.6);
    rocketExplodeSFX.rate(Math.random() * 0.2 + 0.6);
    rocketExplodeSFX.play();
  },
  blank: function(x, y) {
    rocketExplodeSFX.volume(0.6);
    rocketExplodeSFX.rate(Math.random() * 0.2 + 0.6);
    rocketExplodeSFX.play();
  },
  small: function(x, y) {
    let color = pickRand(graphics.COLORS);
    for(let i = 0; i < 300; i++){
      let [dx, dy] = getVector(Math.random() * TAU);
      
      let force = 40 * (1 - Math.random() ** 2);
      
      dx *= force;
      dy *= force;
      
      spawnEmber(color, Math.random() * 0.4, x, y, dx, dy);
    }
    
    rocketExplodeSFX.volume(0.05);
    rocketExplodeSFX.rate(Math.random() * 0.2 + 0.6);
    rocketExplodeSFX.play();
  },
  layered: function(x, y) {
    explosions.basic(x, y);
    explosions.basic(x, y, 20, 1.5);
  },
  convoluted: function(x, y) {
    explosions.basic(x, y);
    
    let rotOffset = TAU * Math.random();
    for(let i = 0; i < 6; i++){
      let angle = TAU * (i / 6) + rotOffset;
      let [dx, dy] = getVector(angle);
      let force = 70; 
      dx *= force;
      dy *= force;
      
      spawnRocket(
        explosions.small,
        phys.CONDITIONS.SHORT_FUSE,
        x,
        y,
        dx, dy
      );
    }
  }
};

function getTextWarhead(text, scale) {
  let canv = document.createElement("canvas");
  let ctx = canv.getContext("2d");
  
  canv.width = 80;
  canv.height = 40;
  
  ctx.font = "24px arial";
  ctx.fillText(text, 10, canv.height - 10);
  
  let points = [];
  
  let imageData = ctx.getImageData(0, 0, canv.width, canv.height);
  let data = imageData.data;
  
  let minX = canv.width;
  let maxX = 0;
  let minY = canv.height;
  let maxY = 0;
  
  for(let i = 0; i < data.length; i += 4){
    let index = i / 4;
    
    let a = data[i + 3] / 255;
    
    if(a < 0.1) continue;
    
    let x = (index % canv.width) + 0.5;
    let y = Math.floor(index / canv.width) + 0.5;
    
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    
    let dx = x;
    let dy = y;
    
    dx *= Math.random() * 0.1 + 0.95;
    dy *= Math.random() * 0.1 + 0.95;
    
    points.push({dx, dy});
  }
  
  let textWidth = maxX - minX;
  let textHeight = maxY - minY;
  
  points.forEach((cur, i, arr) => {
    let {dx, dy} = cur;
    
    dx -= minX + textWidth / 2;
    dy -= minY + textHeight / 2;
    
    dx *= scale;
    dy *= scale;
    
    
    arr[i] = {dx, dy};
  });
  
  return (x, y) => {
    let color = pickRand(graphics.COLORS);
    for(let {dx, dy} of points)
      spawnEmber(color, 1 + Math.random(), x, y, dx, dy);
      
    rocketExplodeSFX.volume(0.6);
    rocketExplodeSFX.rate(Math.random() * 0.2 + 0.6);
    rocketExplodeSFX.play();
  };
}