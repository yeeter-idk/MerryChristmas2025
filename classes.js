class emberC {
  constructor(color, life, x, y, sx, sy) {
    this.color = color;
    this.startLife = life;
    this.life = life;
    
    this.lx = x;
    this.ly = y;
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
  }
  
  update() {
    if(embers.length > phys.maxEmbers) return true;
    
    this.life -= deltaTime;
    
    if(this.life < 0 || this.life > this.startLife){
      if(Math.random() < 0.004){
        //crackerSFX.rate(Math.random() * 0.2 + 0.9);  
        crackerSFX.rate(Math.random() * 0.4 + 0.8, crackerSFX.play("last"));
      }
      return true;
    }
    
    this.lx = this.x;
    this.ly = this.y;
    
    this.x += this.sx * deltaTime;
    this.y += this.sy * deltaTime;
    
    this.sy += phys.gravity * deltaTime;
    
    let frictionMult = Math.pow(phys.airFriction, deltaTime);
    this.sx *= frictionMult;
    this.sy *= frictionMult;
    
    if(this.life - 1.5 * Math.random() > 0){
      graphics.addLine("silver", this.lx, this.ly, this.x, this.y);
    }
    graphics.addLine(this.color, this.lx, this.ly, this.x, this.y);
    
    return false;
  }
}

class rocketC {
  constructor(warheadType, expCondition, x, y, sx, sy, color = -1) {
    this.warheadType = warheadType;
    this.expCondition = expCondition;
    
    this.lx = x;
    this.ly = y;
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    
    this.time = 0;
    
    if(color == -1){
      this.color = Math.random() < 0.5 ? "white" : pickRand(graphics.COLORS);
    }else{
      this.color = color;
    }
  }
  
  update() {
    this.time += deltaTime;
    
    this.lx = this.x;
    this.ly = this.y;
    
    this.x += this.sx * deltaTime;
    this.y += this.sy * deltaTime;
    
    this.sy += phys.gravity * deltaTime;
    
    let frictionMult = Math.pow(phys.airFriction, deltaTime);
    this.sx *= frictionMult;
    this.sy *= frictionMult;
    
    graphics.addLine(this.color, this.lx, this.ly, this.x, this.y);
    //graphics.addLine("silver", this.lx, this.ly, this.x, this.y);
    
    if(this.time < 0) return true;
    
    if(this.expCondition(this.sy, this.time)){
      this.warheadType(this.x, this.y);
      return true;
    }
    return false;
  }
}