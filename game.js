//@author Ze'ev Lailari
// Inspiration from -> github.com/Anemy/Personal-Site

var canvas,ctx;
var time;

var blockSize = 30;
var numAnemies = 3;
var rend = 0;

var dogR, dogL, dogRPara, dogLPara, para;
var dogImage = dogR;

var downwards;

var jump;
var fallspeed = 4;

var originalWidth = 600;
var originalHeight = 400;

var blockUpdateCounter = 0;
var onBlock = -1;

var pops = {
    x: 200,
    y: 200,
    width: blockSize,
    height: blockSize,
    mid: 200+(blockSize/2),
    mov_speed: 200,
    x_vel: 0,
    y_vel: 0,
    color: '#c00'
};
var Anemies = [];
for(var i=0;i<numAnemies;i++) {
    Anemies.push({
    x: (600-blockSize)*Math.random(),
    y: 100*Math.random(),
    width: blockSize*2,
    height: blockSize,
    x_vel: 2,
    y_vel: 2,
    color: '#c00'
    });
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    gameWidth = window.innerWidth-300;
    gameHeight = window.innerHeight-300;
    
    ctx.canvas.width = gameWidth;
    ctx.canvas.height = gameHeight;
    
    scale = gameWidth/originalWidth;
    yScale = gameHeight/originalHeight;

    loadImages();

    resetGame();

    time = Date.now();

    setInterval(run, 10);
}

function resetGame() {

}

function loadImages() {
    //dogs
    dogRPara = new Image();
    dogRPara.src = (("game/pics/DogRPara.png"));
    dogLPara = new Image();
    dogLPara.src = (("game/pics/DogLPara.png"));
    dogR = new Image();
    dogR.src = (("game/pics/DogR.png"));
    dogL = new Image();
    dogL.src = (("game/pics/DogL.png"));
    dogImage = dogRPara;
    para = new Image();
    para.src = (("game/pics/para.png"));
}
 
var keysDown = {};
window.addEventListener('keydown', function(e) {
    keysDown[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
    delete keysDown[e.keyCode];
});
 
function update(mod) {
    // Control keys
    // left
    if (37 in keysDown) {
        pops.x -= pops.mov_speed * mod;
        dogImage = dogL;
    }
    // up
    if (38 in keysDown) {
        // pops.y -= pops.speed * mod;
        if(!jump) {
            pops.y_vel = -canvas.height/2 - (1000/pops.height);
            fallspeed = 1;
            jump = true; 
        } 
    }
    // right
    if (39 in keysDown) {
        pops.x += pops.mov_speed * mod;
        dogImage = dogR;
    }
    // down
    if (40 in keysDown) {
        // pops.y += pops.speed * mod;
    }
    pops.y += pops.y_vel * mod;
    pops.x -= pops.x_vel * mod;


    popsGravity();
    popsEnforceBounds();
    pops.mid = pops.x + (pops.width/2);
}

function popsGravity() {
     if(pops.y_vel < canvas.height/4) {
        pops.y_vel += fallspeed;
    }
    if(pops.y_vel > 15) {
        downwards = true;
        fallspead = 2;
        if(dogImage === dogL || dogImage === dogLPara) {
            dogImage = dogLPara;
        } else {
            dogImage = dogRPara;
        }
    } else {
        downwards = false;
        if(dogImage === dogL || dogImage === dogLPara) {
            dogImage = dogL;
        } else {
            dogImage = dogR;
        }
    }
}

function moveAnemies(mod) {
    for (var i=0;i<numAnemies;i++) {

        if(Anemies[i].x>(canvas.width/2)) {
            Anemies[i].x_vel -= .25;
        } else if(Anemies[i].x>(canvas.width/2)) {
            Anemies[i].x_vel -= .125;
        } else if(Anemies[i].x<(canvas.width/2)) {
            Anemies[i].x_vel += .125;
        } else {
            Anemies[i].x_vel += 25;
        }

        if(Anemies[i].y>(canvas.height/2)) {
            Anemies[i].y_vel -= .25;
        } else if(Anemies[i].y>(canvas.height/2)) {
            Anemies[i].y_vel -= .125;
        } else if(Anemies[i].y<(canvas.height/2)) {
            Anemies[i].y_vel += .125;
        } else {
            Anemies[i].y_vel += .25;
        }
    }
    for (var j=0;j<numAnemies;j++) {
        Anemies[j].x += Anemies[j].x_vel;
        Anemies[j].y += Anemies[j].y_vel;
    }


}

function popsEnforceBounds() {
    // Enforce canvas bounds
    if (pops.x < 0) {
        pops.x = 0;
    }
    if (pops.y < 0) {
        pops.y = 5;
        pops.y_vel = 1;
    }
    if (pops.x > (canvas.width-pops.width)) {
        pops.x = canvas.width-pops.width;
    }
    if (pops.y > (canvas.height-pops.height)) {
        pops.y = canvas.height-pops.height;
        pops.y_vel = 0;
        jump = false;
    }
}
 
function render() {
    ctx.fillStyle = "#FFFFFF";
    // var radgrad4 = ctx.createLinearGradient(0,0,0,canvas.height);
    //     radgrad4.addColorStop(0, "white");
    //     radgrad4.addColorStop(1, "#FFFF90");

    // ctx.fillStyle = radgrad4;

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(var i=0; i<numAnemies;i++) {
        ctx.fillStyle = '#00F';
        ctx.fillRect(Anemies[i].x,Anemies[i].y,Anemies[i].width,Anemies[i].height);
    }

    ctx.drawImage(dogImage, pops.x, pops.y, pops.width, pops.height);
    if(downwards) {
        ctx.drawImage(para, pops.x, pops.y-pops.height, pops.width, pops.height);        
    }
}

function resetPops() {
    onBlock = -1;
    pops.x_vel = 0;
}

function bounce(i) {
    pops.x_vel *= -1;
    pops.x_vel *= -1;
    Anemies[i].x_vel *= -1;
    Anemies[i].x_vel *= -1;

}

function collisions() {
    for (var i=0;i<numAnemies;i++) {
        if (pops.y > (Anemies[i].y-Anemies[i].height) && pops.y < (Anemies[i].y)) {
            if (pops.mid > Anemies[i].x && pops.mid < (Anemies[i].x+Anemies[i].width)) {
                // onBlock = i;
                // jump = false;
                bounce(i);
            } else { resetPops() }
        } else { resetPops() }
    }
    if (onBlock > -1) {
        pops.x_vel = Anemies[onBlock].x_vel;
        pops.y_vel = Anemies[onBlock].y_vel;
    }
}
 
function run() {
    if(blockUpdateCounter > 1) {
        moveAnemies();
        blockUpdateCounter = 0;
    } blockUpdateCounter++;
    update((Date.now() - time) / 1000);
    collisions();
    render();
    time = Date.now();
}