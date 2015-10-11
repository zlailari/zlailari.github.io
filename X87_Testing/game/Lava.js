// The lava platform class

// basic platform things and stuff
var Lava = function (xPos, yPos, width, height) {
    this.x = xPos;
    this.y = yPos;

    this.offset = 0;
    this.increasingAlpha = true;
    this.alpha = 0.0;

    this.width = width;
    this.height = height;

    this.ID = -1;
    this.color = "rgb(255,0,0)"; //default color red
}

//draw
drawLava = function(ctx, lava, sX, sY) {
    //ctx.fillStyle = lava.color;
    //ctx.fillRect(lava.x, lava.y, lava.width, lava.height);
    lava.offset += 0.15;
    if(lava.offset > 300) {
      lava.offset = 0;
    }


    if(lava.increasingAlpha) {
        lava.alpha += 0.005;
        if(lava.alpha > 1) {
            lava.alpha = 1;
            lava.increasingAlpha = false;
        }
    }
    else {
        lava.alpha -= 0.005;
        if(lava.alpha < 0) {
            lava.alpha = 0;
            lava.increasingAlpha = true;
        }
    }
    // for(var i = 0; i < Math.floor(lava.width/1000) + 2; i++) {
        ctx.drawImage(lavaImage, 0, lava.offset, lava.width, lava.height, lava.x, lava.y, lava.width, lava.height);
    // }
    //console.log(lava.alpha);
    ctx.globalAlpha = 0.5;//lava.alpha;
    //lava image size is 1000x600
    // for(var i = 0; i < Math.floor(lava.width/1000) + 1; i++) {
        ctx.drawImage(lavaImage, 0, lava.offset/2, lava.width, lava.height, lava.x, lava.y, lava.width, lava.height);
    // }
    ctx.globalAlpha = 1;
}
