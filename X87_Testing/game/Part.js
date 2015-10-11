/* 

Manages the lifetime of particles

*/

var parts = [];
const maxPartSpeed = 160.0;
const minPartSpeed = 10.0;
const partFallSpeed = -30;

const particleLifeTime = 0.5;

var part = function (xpos, ypos, xdir, ydir, color) {
    this.width = 8.0;
    this.height = 8.0;

    this.x = xpos;
    this.y = ypos;

    this.xdir = xdir;
    this.ydir = ydir;

    this.life = particleLifeTime;

    this.colorType = color;
    console.log('color: ' + this.colorType);

    this.rotation = 0; //anything between 0-360 ctx.rotate(20*Math.PI/180);
    this.rotationVelo = 0;

    this.rotation = Math.random()*359.0;
    this.rotationVelo = getNegative(Math.random()*359.0);
}

function drawParts(ctx) {
    //draw particles
    ctx.lineWidth = "1";
    ctx.strokeStyle = "rgb(10,10,40)";
    for(i = 0; i < parts.length; i++) {
        ctx.globalAlpha = (parts[i].life/particleLifeTime); // was 0.6*
        //color
        ctx.fillStyle = parts[i].colorType;

        ctx.translate(parts[i].x, parts[i].y);// height - 
        ctx.rotate(parts[i].rotation*(Math.PI/180));
        ctx.fillRect((-parts[i].width/2) ,(-parts[i].height/2),parts[i].width,parts[i].height);

        ctx.beginPath();
        ctx.rect((-parts[i].width/2) ,(-parts[i].height/2),parts[i].width,parts[i].height);
        ctx.stroke();

        ctx.rotate(-parts[i].rotation*(Math.PI/180));
        ctx.translate(-parts[i].x, -parts[i].y); //-height + 
        ctx.globalAlpha = 1;
    }
}

var updateParts = function(delta) {
    // update particles (and kill if needed)
    for(i = parts.length-1; i >= 0; i--) {
        parts[i].x += parts[i].xdir*delta;
        parts[i].y += parts[i].ydir*delta;

        parts[i].ydir += partFallSpeed*delta;

        parts[i].rotation += parts[i].rotationVelo*delta;
        if(parts[i].rotation > 360.0) {
            parts[i].rotation -= 360.0;
        }
        else if(parts[i].rotation < 0.0) {
            parts[i].rotation += 360.0;
        }


        // kill it slowly
        parts[i].life -= delta;

        if(parts[i].life <= 0) {
            parts.splice(i, 1);
        }
    }
}
