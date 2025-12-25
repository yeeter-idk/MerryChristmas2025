let sequenceManager = {
  time: 0,
  parts: [],
  run: false,
  index: 0,
  runSequence: function(sequence) {
    this.parts = sequence;
    this.index = 0;
    this.run = false;
    this.time = 0;
  },
  update: function() {
    if(this.parts.length == 0) return;
    this.time += deltaTime;
    
    if(!this.run){
      if(this.parts[this.index].execute(this.time))
        this.run = true;
    }
    
    if(this.parts[this.index].duration < this.time){
      this.index++;
      this.time = 0;
      this.run = false;
      if(this.index >= this.parts.length){
        this.index = 0;
        this.parts = [];
      }
    }
  }
};

let SEQUENCE_PARTS = {
  FLARE_SWIPE: {
    duration: 3,
    execute: function(time) {
      let amount = Math.ceil(deltaTime * 50);
      let angle = (time / 3) * 2 - 1;
      
      let [dx, dy] = getVector(-Math.PI / 2 + angle);
      
      let distanceFromSide = canvas.width / 8;
      
      for(let i = 0; i < amount; i++){
        let speed = 80 + 5 * Math.random();
        let [sx, sy] = [dx * speed, dy * speed];
        spawnEmber("white", Math.random(), distanceFromSide, canvas.height, sx, sy);
        spawnEmber("white", Math.random(), canvas.width - distanceFromSide, canvas.height, -sx, sy);
      }
      
      return false;
    }
  },
  FLARE_SUSTAIN: {
    duration: 5,
    execute: function(time) {
      let amount = Math.ceil(deltaTime * 10);
      
      let offset = Math.sin(time / 5 * TAU * 1.5);
      
      for(let i = 1; i < 10; i++){
        let x = canvas.width / 10 * i;
        let y = canvas.height;
        for(let j = 0; j < amount; j++){
          let speed = 80 + 5 * Math.random();
          
          let [dx, dy] = getVector(-Math.PI / 2 + offset);
          dx *= speed;
          dy *= speed;
          
          spawnEmber("white", Math.random(), x, y, dx, dy);
        }
      }
      
      return false;
    }
  },
  DISNEY_ARC: {
    duration: 1,
    execute: function(time) {
      
      let amount = 20;
      for(let i = 0; i < amount; i++){
        let t = i + 0.5;
        let [dx, dy] = getVector((t / amount + 1) * Math.PI);
        let radius = canvas.width / 2;
        //dy *= -dy;
        
        spawnNormRocket(explosions.small, phys.CONDITIONS.CUSTOM_FUSE(t / amount * 2 + 3), 
          canvas.width / 2, canvas.height,
          canvas.width / 2 + dx * radius,
          canvas.height + dy * (canvas.height / 3 * 2)
        );
      }
      
      return true;
    }
  },
  MAIN_FINAL_BLOW: {
    duration: 5,
    execute: function(time) {
      let tX = canvas.width / 2;
      let tY = canvas.height / 2;
      
      spawnNormRocket(explosions.convoluted, phys.CONDITIONS.DEFAULT,
        canvas.width / 2, canvas.height,
        tX, tY 
      );
      
      spawnNormRocket(explosions.small, phys.CONDITIONS.DEFAULT,
        canvas.width, canvas.height,
        canvas.width / 4, tY 
      );
      
      spawnNormRocket(explosions.small, phys.CONDITIONS.DEFAULT,
        0, canvas.height,
        canvas.width / 4 * 3, tY 
      );
      
      return true;
    }
  },
  HEART: {
    duration: 1,
    execute: function(time) {
      spawnNormRocket(getTextWarhead("❤️", 2.5), phys.CONDITIONS.CUSTOM_FUSE(6), 
        canvas.width / 2,
        canvas.height,
        canvas.width / 2,
        canvas.height / 5
      );
      return true;
    }
  },
  F: {
    duration: 1,
    execute: function(time) {
      spawnNormRocket(getTextWarhead("F", 2.5), phys.CONDITIONS.CUSTOM_FUSE(5), 
        canvas.width / 2,
        canvas.height,
        canvas.width / 6,
        canvas.height / 5 * 2
      );
      return true;
    }
  },
  A: {
    duration: 1,
    execute: function(time) {
      spawnNormRocket(getTextWarhead("A", 2.5), phys.CONDITIONS.CUSTOM_FUSE(4), 
        canvas.width / 2,
        canvas.height,
        canvas.width / 6 * 2,
        canvas.height / 5 * 2
      );
      return true;
    }
  },
  I: {
    duration: 1,
    execute: function(time) {
      spawnNormRocket(getTextWarhead("I", 2.5), phys.CONDITIONS.CUSTOM_FUSE(3), 
        canvas.width / 2,
        canvas.height,
        canvas.width / 6 * 3,
        canvas.height / 5 * 2
      );
      return true;
    }
  },
  T: {
    duration: 1,
    execute: function(time) {
      spawnNormRocket(getTextWarhead("T", 2.5), phys.CONDITIONS.CUSTOM_FUSE(2), 
        canvas.width / 2,
        canvas.height,
        canvas.width / 6 * 4,
        canvas.height / 5 * 2
      );
      return true;
    }
  },
  H: {
    duration: 1,
    execute: function(time) {
      spawnNormRocket(getTextWarhead("H", 2.5), phys.CONDITIONS.CUSTOM_FUSE(1), 
        canvas.width / 2,
        canvas.height,
        canvas.width / 6 * 5,
        canvas.height / 5 * 2
      );
      return true;
    }
  },
  
};

/*
sequenceManager.runSequence([
  SEQUENCE_PARTS.FLARE_SWIPE, 
  SEQUENCE_PARTS.FLARE_SWIPE, 
  SEQUENCE_PARTS.DISNEY_ARC, 
  SEQUENCE_PARTS.MAIN_FINAL_BLOW, 
  SEQUENCE_PARTS.HEART, 
  SEQUENCE_PARTS.F, 
  SEQUENCE_PARTS.A, 
  SEQUENCE_PARTS.I, 
  SEQUENCE_PARTS.T, 
  SEQUENCE_PARTS.H]) 
*/