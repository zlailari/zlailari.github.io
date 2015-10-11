/* This contains the Puppums class */

//direction facing constants
const LEFT = -1; // should not do 0 because js sometimes typecasts null to 0
const RIGHT = 1;

//player constants (temporary values for now)
const playerRunSpeed = 380;
const playerRunSpeedBuild = 2200;// Build up run speed
const playerAccSpeed = 100;
const playerRunSlowSpeed = 150;
const playerRunDecelSpeed = 1600;
const playerJumpSpeed = 700;
const playerFallSpeed = 1800;
const playerMaxHP = 1000;
const playerRespawnTime = 3;
const maxFallRate = 2000;

//the sizes of the game frame
const frameWidth = 800;
const frameHeight = 600;

const insane = false;
const insaneSpeed = 75;
const insaneJumpSpeed = 125;

// Puppum's images
var dogRm = [];
var dogLm = [];
var dogR;
var dogL;

var soundCounter = 0;

var footStepFile = 'game/sounds/footstep.mp3';
var footStepSounds = [];
footStepSounds.push(new Audio(footStepFile));
footStepSounds.push(new Audio(footStepFile));
footStepSounds.push(new Audio(footStepFile));
footStepSounds.push(new Audio(footStepFile));
footStepSounds.push(new Audio(footStepFile));
footStepSounds.push(new Audio(footStepFile));
footStepSounds.push(new Audio(footStepFile));
footStepSounds.push(new Audio(footStepFile));
footStepSoundCounter = 0;

// Loading images
dogRm[0] = new Image();
dogRm[0].src = "game/pics/DogRm0.png";
dogRm[1] = new Image();
dogRm[1].src = "game/pics/DogRm1.png";
dogLm[0] = new Image();
dogLm[0].src = "game/pics/DogLm0.png";
dogLm[1] = new Image();
dogLm[1].src = "game/pics/DogLm1.png";
dogR = new Image();
dogR.src = "game/pics/DogR.png";
dogL = new Image();
dogL.src = "game/pics/DogL.png";

//popXPos , popYPos , popXDir , popYDir , popFacing(0 or 1) , runCount
var Puppums = function () {
    this.x = 0;
    this.y = 0;

    this.xDir = 0;
    this.yDir = 0;

    this.xDirExternal = 0;
    this.yDirExternal = 0;
    this.onVertPlatformUp = false;
    this.onVertPlatformDown = false;

    this.facing = RIGHT; //1 right -1 left
    this.left = false;
    this.right = false;

    this.runCount = 0;

    this.jump = false;
    this.floor = false;
    this.space = false;

    // square dimensions
    this.width = 26;
    this.height = 26;

    // not sure if I want to do it this way or not lol
    this.draw = function() {

    }
};

// Move into Puppums?
function updatePuppumsPos(delta) {

    // update run image counter
    puppums.runCount += delta * 10;

    if((puppums.left || puppums.right) && puppums.floor) {
        soundCounter += delta * 10;
        if (soundCounter >= 1.5) {
                // Play the footstep sound lol
        
                footStepSounds[footStepSoundCounter].play();

                footStepSoundCounter++;
                if(footStepSoundCounter >= footStepSounds.length) {
                    footStepSoundCounter = 0;
                }
            soundCounter = 0;
        }
    }
    else {
        soundCounter = 1.5;
    }


    if (puppums.runCount >= 2) {
        puppums.runCount = 0;
    }

    if (puppums.left == true) {
        // puppums.xDir = -playerRunSpeed;
        puppums.xDir -= playerRunSpeedBuild*delta;
        if(puppums.xDir < -playerRunSpeed) {
            puppums.xDir = -playerRunSpeed;
        }
    }
    else if (puppums.right == true) {
        puppums.xDir += playerRunSpeedBuild*delta;
        if(puppums.xDir > playerRunSpeed) {
            puppums.xDir = playerRunSpeed;
        }
    }
    else {
        // puppums.xDir = 0;
        // Decel puppums when not moving to 0
        if(puppums.xDir > 0) {
            puppums.xDir -= playerRunDecelSpeed * delta;
            if(puppums.xDir < 0) {
                puppums.xDir = 0;
            }
        }
        else if(puppums.xDir < 0) {
            puppums.xDir += playerRunDecelSpeed * delta;
            if(puppums.xDir > 0) {
                puppums.xDir = 0;
            }
        }
    }

    // update player x, y positions
    if(!puppums.onVertPlatformUp && !puppums.onVertPlatformDown){
        puppums.y += puppums.yDir * delta + puppums.yDirExternal * delta;
    }
    puppums.x += puppums.xDir * delta + puppums.xDirExternal * delta;

    // check if player is in air
    if (puppums.yDir != 0) {
        puppums.floor = false;
    }

    // update falling spped
    if (puppums.yDir < maxFallRate && !puppums.floor && !puppums.onVertPlatformUp && !puppums.onVertPlatformDown)
    {
        puppums.yDir += playerFallSpeed * delta;
    }

    // edge of map x
    if (puppums.x + (puppums.xDir * delta) >= width - puppums.width) {
        puppums.x = width - puppums.width - 1;
        if (puppums.xDir > 0.01)
            puppums.xDir = 0;
    }
    if (puppums.x + (puppums.xDir * delta) <= 0) {
        puppums.x = 1;
        if (puppums.xDir < -0.01) {
            puppums.xDir = 0;
        }
    }

    var overrideFloor = false;
    // bottom y collision
    if (puppums.y + (puppums.yDir * delta) > height - puppums.height && puppums.yDir > 0) {
        // stop player from falling
        puppums.yDir = 0;
        puppums.y = height - puppums.height;
        puppums.jump = false;
        overrideFloor = true;
    }

    // JUMP!
    if(puppums.floor && puppums.space) {
        // console.log('JMUPJUMPJUMP');
        puppums.jump = true;
        puppums.yDir = -playerJumpSpeed;
    }
    puppums.floor = false;
    if(overrideFloor) {
        puppums.floor = true;
    }

    // console.log('Puppums pos: ' + puppums.x + "  " + puppums.y);
    // console.log('Puppums dir: ' + puppums.xDir + "  " + puppums.yDir);
}

// Move into Puppums?
function drawPuppums(puppums) {
    var dogImage;
    if (puppums.left && puppums.yDir == 0) {
        if (puppums.runCount <= 1) {
            dogImage = dogLm[0];
        }
        if (puppums.runCount > 1) {
            dogImage = dogLm[1];
        }
    }
    else if (puppums.right && puppums.yDir == 0) {
        if (puppums.runCount <= 1) {
            dogImage = dogRm[0];
        }
        if (puppums.runCount > 1) {
            dogImage = dogRm[1];
        }
    }
    else {
        if (puppums.facing == LEFT)
            dogImage = dogL;
        else if (puppums.facing == RIGHT)
            dogImage = dogR;

    }

    // if(yScale < scale)
    //     ctx.drawImage(dogImage, puppums.xPos * scale, gameHeight * (puppums.yPos/originalHeight) - ((puppums.width*scale) - puppums.width) , puppums.width * scale, puppums.width * scale);
    // else
       ctx.drawImage(dogImage, puppums.x, puppums.y, puppums.width, puppums.height);
}