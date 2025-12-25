let graphics = {
  COLORS: ["red", "blue", "yellow", "lime", "cyan", "blueViolet", "hotPink", "white", "silver"],
  colorSlots: [],
  maxLinesPerBatch: 3000,
  setupFrame: function() {
    this.colorSlots = [];
    for(let i = 0; i < this.COLORS.length; i++)
      this.colorSlots.push([]);
  },
  addLine: function(color, ax, ay, bx, by) {
    let colorIndex = this.COLORS.indexOf(color);
    if(this.colorSlots[colorIndex].length >= this.maxLinesPerBatch) return;
    this.colorSlots[colorIndex].push({ax, ay, bx, by});
  },
  drawFrame: function() {
    for(let i = 0; i < this.COLORS.length; i++){
      let batch = this.colorSlots[i];
      if(batch.length == 0) continue;
      
      ctx.strokeStyle = this.COLORS[i]; 
      ctx.beginPath();
      for(let {ax, ay, bx, by} of batch){
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
      }
      ctx.stroke();
    }
    
    this.colorSlots = [];
  }
}