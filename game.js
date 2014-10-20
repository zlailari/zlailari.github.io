//@author Ze'ev Lailari
// Original code from -> http://html5gamedev.samlancashire.com/making-a-simple-html5-canvas-game-part-3-drawing-images/

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "#000000";
// var radgrad4 = ctx.createLinearGradient(0,0,0,canvas.height);
//     radgrad4.addColorStop(0, "white");
//     radgrad4.addColorStop(1, "#FFFF90");

// ctx.fillStyle = radgrad4;
ctx.fillRect(0,0,canvas.width,canvas.height);

canvas.width = 600;
canvas.height = 400;

var blockSize = 30;
var numAnemies = 3;
var rend = 0;

loadImages();
var downwards;
var pops = {
    x: 200,
    y: 200,
    width: blockSize,
    height: blockSize,
    x_speed: 200,
    y_speed: 0,
    color: '#c00'
};
var Anemies = [];
for(var i=0;i<numAnemies;i++) {
    Anemies.push({
    x: 0,
    y: -blockSize,
    width: blockSize*2,
    height: blockSize,
    x_speed: 200,
    y_speed: 0,
    color: '#c00'
    });
}

// var Anemy = {
//     x: -,
//     y: 200,
//     width: 2*,
//     height: blockSize,
//     x_speed: 200,
//     y_speed: 0,
//     color: '#c00'
// };

var dogR, dogL, dogRPara, dogLPara;
var dogImage = dogR;
var jump;
var fallspeed = 4;

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
        pops.x -= pops.x_speed * mod;
        dogImage = dogL;
    }
    // up
    if (38 in keysDown) {
        // pops.y -= pops.speed * mod;
        if(!jump) {
            pops.y_speed = -canvas.height/2 - (6000/pops.height);
            fallspeed = 3;
            jump = true; 
        }
    }
    // right
    if (39 in keysDown) {
        pops.x += pops.x_speed * mod;
        dogImage = dogR;
    }
    // down
    if (40 in keysDown) {
        // pops.y += pops.speed * mod;
    }
    pops.y += pops.y_speed * mod;

    gravity();

    enforceBounds();
}

function gravity() {
     if(pops.y_speed < canvas.height/4) {
        pops.y_speed += fallspeed;
    }
    if(pops.y_speed > 15) {
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

function enforceBounds() {
    // Enforce canvas bounds
    if (pops.x < 0) {
        pops.x = 0;
    }
    if (pops.y < 0) {
        pops.y = 0;
        pops.y_speed = 0;
    }
    if (pops.x > (canvas.width-pops.width)) {
        pops.x = canvas.width-pops.width;
    }
    if (pops.y > (canvas.height-pops.height)) {
        pops.y = canvas.height-pops.height;
        pops.y_speed = 0;
        jump = false;
    }
}
 
function render() {
    // if (rend%2 == 0) {
        ctx.fillStyle = '#FFF';
    // } else {
        // ctx.fillStyle = radgrad4;
    // }
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
 
function run() {
    update((Date.now() - time) / 1000);
    render();
    time = Date.now();
}
 
var time = Date.now();
setInterval(run, 10);