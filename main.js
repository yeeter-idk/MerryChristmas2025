let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let TAU = Math.PI * 2;

let deltaTime = 0;
let timeManager = {
  st: -1,
  time: 0,
  aveDT: 0,
  update: function() {
    let time = performance.now();
    if(this.st < 0)
      this.st = time;
      
    deltaTime = (time - this.st) / 1000;
    this.time += deltaTime;
    
    this.st = time;
    
    this.aveDT = this.aveDT * 0.9 + deltaTime * 0.1;
  }
};

let phys = {
  gravity: 13,
  airFriction: 0.6,
  CONDITIONS: {
    DEFAULT: (s, t) => t > 3,
    CUSTOM_FUSE: (time) => {return (s, t) => t > time},
    SHORT_FUSE: (s, t) => t > 0.8,
    SPEED_THRESH: (s, t) => s > -70
  },
  maxEmbers: 5000
};

let gravitySensor = new GravitySensor({ frequency: 60 });

let easterEggManager = {
  shakes: 0,
  time: 0,
  sign: 1,
  update: function() {
    if(this.shakes >= 1)
      this.time += deltaTime;
      
    let value = gravitySensor.x;
    
    if(Math.sign(value) == -this.sign && Math.abs(value) > 5){
      this.shakes++;
      this.sign = Math.sign(value);
    }
    
    if(this.time > 2){
      if(this.shakes >= 7){
        console.log("successful");
        if(sequenceManager.parts.length == 0)
          sequenceManager.runSequence([
            SEQUENCE_PARTS.FLARE_SWIPE, 
            SEQUENCE_PARTS.FLARE_SWIPE, 
            SEQUENCE_PARTS.DISNEY_ARC, 
            SEQUENCE_PARTS.MAIN_FINAL_BLOW,          
            SEQUENCE_PARTS.FLARE_SUSTAIN, 
            SEQUENCE_PARTS.HEART, 
            SEQUENCE_PARTS.F, 
            SEQUENCE_PARTS.A, 
            SEQUENCE_PARTS.I, 
            SEQUENCE_PARTS.T, 
            SEQUENCE_PARTS.H]) 
      }else{
        console.log("rejected");
      }
      
      this.time = 0;
      this.shakes = 0;
    }
  }
};

let rocketExplodeSFX = new Howl({
  src: ['exp1.mp3'],
  volume: 0.7
});

let crackerSFX = new Howl({
  src: ['cracker.mp3'],
  sprite: {
    last: [3500, 6000]
  },
  volume: 0.1
});

//rocketExplodeSFX.filter(1000)

const audioContext = Howler.ctx;
const lowpassFilter = audioContext.createBiquadFilter();
lowpassFilter.type = 'lowpass';
lowpassFilter.frequency.value = 6000; // Set initial cutoff frequency (Hz)

rocketExplodeSFX.on('play', () => {
  // Access the underlying Web Audio node
  const soundNode = rocketExplodeSFX._sounds[0]._node;
  
  // Connect: Source -> Filter -> Destination
  //soundNode.disconnect(Howler.masterGain);
  soundNode.disconnect();
  soundNode.connect(lowpassFilter);
  lowpassFilter.connect(Howler.masterGain);
});

let embers = [];
let rockets = [];

setup();

function setup() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  gravitySensor.start();

  loop();
}

//let loopManager = setInterval(loop, 1000 / 30);

function loop() {
  timeManager.update();
  window.requestAnimationFrame(loop);
  
  easterEggManager.update();
  sequenceManager.update();
  
  if(timeManager.time > 5 && sequenceManager.parts.length == 0){
    let orgX = Math.random() * canvas.width; 
    let orgY = canvas.height;
    
    let [sx, sy] = computeLaunchSpeed(phys.CONDITIONS.DEFAULT, orgX, orgY, canvas.width * Math.random(), canvas.height * Math.random());
  
    rockets.push(new rocketC(
      pickRand([
        explosions.basic,
        explosions.spiked,
        explosions.blank,
        explosions.small,
        explosions.layered,
        explosions.convoluted
      ]),
      phys.CONDITIONS.SPEED_THRESH,
      orgX,
      orgY,
      sx, sy
    ));
    
    timeManager.time -= 5;
  }
  
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.globalCompositeOperation = "darken";
  ctx.fillStyle = "black";
  ctx.globalAlpha = 3 * deltaTime;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  
  ctx.globalCompositeOperation = "lighten";
  graphics.setupFrame();
  
  for(let i = 0; i < rockets.length; i++){
    if(rockets[i].update()){
      rockets.splice(i, 1);
      i--;
    }
  }
  
  for(let i = 0; i < embers.length; i++){
    if(embers[i].update()){
      embers.splice(i, 1);
      i--;
    }
  }
  
  let drawProfile = "";
  for(let i = 0; i < graphics.COLORS.length; i++)
    if(graphics.colorSlots[i].length != 0)
      drawProfile += "\n  " + graphics.COLORS[i] + ": " + graphics.colorSlots[i].length;
  
  graphics.drawFrame();
  
  document.getElementById("debug").innerText = 
  "FPS: " + Math.round(1 / timeManager.aveDT * 100) / 100 + 
"\nEmbers: " + embers.length +
"\nRockets: " + rockets.length +  
"\nDraws: "
   drawProfile;
}