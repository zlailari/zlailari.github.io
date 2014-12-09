//@author Ze'ev Lailari
// Inspiration from -> github.com/Anemy/Personal-Site

var canvas,ctx;
var time;

// constant for size of character and enemies
var blockSize = 30;
var numAnemies = 8;

// All images
var dogR, dogL, dogRPara, dogLPara, para, bg, astr;
var dogImage = dogR;

var downwards = true;

var jump;
var fallspeed = 4;

var originalWidth = 600;
var originalHeight = 400;

var blockUpdateCounter = 0;
var onBlock = -1;

// used for touch
var startTouch, endTouch;

var startRender = false;

// Initialize your character
var pops = {
    x: 200,
    y: 200,
    width: blockSize,
    height: blockSize,
    //mid: 200+(blockSize/2),
    mov_speed: 200,
    x_vel: 0,
    y_vel: 0,
    color: '#c00'
};

// Initialize enemies
var Anemies = [];
for(var i=0;i<numAnemies;i++) {
    Anemies.push({
    x: (1000-blockSize)*Math.random(),
    y: 100*Math.random(),
    width: blockSize*2,
    height: blockSize,
    x_vel: 2*Math.random()+1.5,
    y_vel: Math.random()+.5,
    color: '#c00'
    });
}

function init() {
    canvas = document.getElementById('bCanvas');
    ctx = canvas.getContext('2d');

    gameWidth = window.innerWidth-300;
    gameHeight = window.innerHeight-300;
    
    // ctx.canvas.width = gameWidth;
    // ctx.canvas.height = gameHeight;

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height= window.innerHeight;

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
    // Background image
    bg = new Image();
    bg.src = (("game/pics/SpaceBackground.jpg"));
    bg.onload = function() {
        startRender = true;
    }
    astr = new Image();
    // Astroid Image
    astr.src = (("game/pics/Astroid.png"));
    dogRPara = new Image();
    // Dog and parachute images
    dogRPara.src = (("game/pics/DogRPara.png"));
    dogLPara = new Image();
    dogLPara.src = (("game/pics/DogLPara.png"));
    dogR = new Image();
    dogR.src = (("game/pics/DogR.png"));
    dogL = new Image();
    dogL.src = (("game/pics/DogL.png"));
    dogImage = dogRPara;
    para = new Image();
    para.src = (("game/pics/Para.png"));    
}
 
var keysDown = {};
window.addEventListener('keydown', function(e) {
    keysDown[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
    delete keysDown[e.keyCode];
});

// Basic code for mobile/touch screen
window.addEventListener('touchstart', this.touchStart, false);
function touchStart(evt) {
    // Mobile up
    if(!jump) {
        pops.y_vel = -canvas.height/2 - (4000/pops.height);
        fallspeed = 1;
        jump = true; 
    } 
    startTouch = {x:evt.touches[0].pageX, y:evt.touches[0].pageY};
    var nextTouches

}
window.addEventListener('touchmove', this.touchMove, false);
function touchMove(evt) {
    // Store move points as last point so we can 
    //  calculate which way was swiped
    endTouch = {x:e.touches[0].pageX, y:e.touches[0].pageY};
}


window.addEventListener('touchend', this.touchEnd, false);
function touchEnd(evt) {
    if (touchStart.x > endTouch.x) {
        // left
        pops.x -= pops.mov_speed * mod;
        dogImage = dogL;
    } else {  
        // right
        pops.x += pops.mov_speed * mod;
        dogImage = dogR;
    }
}
 
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
            pops.y_vel = -canvas.height/2 - (4000/pops.height);
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

    // enforce max/min velocity conditions
    if (pops.x_vel > 0) {
        pops.x_vel -= 10;
    } else if (pops.x_vel < 0) {
        pops.x_vel += 10;
    }
    if (pops.y_vel > 40) {
        pops.y_vel -= 1;
    } else if (pops.y_vel < 0) {
        pops.y_vel += 1;
    }

    // set new character position
    pops.y += pops.y_vel * mod;
    pops.x += pops.x_vel * mod;

    // sets up variables for next update and chooses picture
    popsGravity();

    popsEnforceBounds();

    // pops.mid = pops.x + (pops.width/2);
}

function popsGravity() {
     if(pops.y_vel < canvas.height/4) {
        pops.y_vel += (fallspeed*3);
    }
    if(pops.y_vel > 30) {
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
        // makes enemy x velocities orbit middle of canvas
        if(Anemies[i].x>(canvas.width/2)) {
            Anemies[i].x_vel -= .125;
        } else if(Anemies[i].x>(canvas.width/2)) {
            Anemies[i].x_vel -= .0625;
        } else if(Anemies[i].x<(canvas.width/2)) {
            Anemies[i].x_vel += .0625;
        } else {
            Anemies[i].x_vel += .125;
        }

        // makes enemy y velocities orbit mid of canvas
        if(Anemies[i].y>(canvas.height/2)) {
            Anemies[i].y_vel -= .07;
        } else if(Anemies[i].y>(canvas.height/2)) {
            Anemies[i].y_vel -= .0625;
        } else if(Anemies[i].y<(canvas.height/2)) {
            Anemies[i].y_vel += .0625;
        } else {
            Anemies[i].y_vel += .125;
        }
    }
    // update enemy positions
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
        pops.x_vel = 0;
        downwards = false;
        jump = false;
    }
}
 
function render() {
    // ctx.fillStyle = "#FFFFFF";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (startRender){
        ctx.drawImage(bg,0,0);

        for(var i=0; i<numAnemies;i++) {
            ctx.fillStyle = '#00F';
            ctx.drawImage(astr, Anemies[i].x,Anemies[i].y,Anemies[i].width,Anemies[i].height);
        }

        ctx.drawImage(dogImage, pops.x, pops.y, pops.width, pops.height);
        if(downwards) {
            ctx.drawImage(para, pops.x, pops.y-pops.height, pops.width, pops.height);        
        }
    }
}

function resetPops() {
    onBlock = -1;
    pops.x_vel = 0;
    
}

function bounce(i) {
    
}

function collisions() {
    for (var i=0;i<numAnemies;i++) {
        if(Anemies[i].x >= pops.x && Anemies[i].x <= pops.x +pops.width) {
            // hit the left side
            if (Anemies[i].y >= pops.y && Anemies[i].y <= pops.y +pops.height) {
                // hit bottom
                pops.x_vel = -500;
                pops.y_vel = 500;
            } else if (Anemies[i].y <= pops.y && Anemies[i].y + Anemies[i].height >= pops.y) {
                // hit top
                pops.x_vel = -500;
                pops.y_vel = -500;
            }
        } else if (Anemies[i].x <= pops.x && Anemies[i].x + Anemies[i].width >= pops.x) {
            // hit the right side
            if (Anemies[i].y >= pops.y && Anemies[i].y <= pops.y +pops.height) {
                // hit bottom
                pops.x_vel = 500;
                pops.y_vel = 500;
            } else if (Anemies[i].y <= pops.y && Anemies[i].y + Anemies[i].height >= pops.y) {
                // hit top
                pops.x_vel = 500;
                pops.y_vel = -500;
            }
        }
    }
}
 
function run() {
    // if(blockUpdateCounter > 1) {
        moveAnemies();
        // blockUpdateCounter = 0;
    // } blockUpdateCounter++;
    update((Date.now() - time) / 1000);
    collisions();
    render();
    time = Date.now();
}
