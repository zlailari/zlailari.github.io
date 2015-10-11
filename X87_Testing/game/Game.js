// @author Rhys Howell + Ze'ev Lailair + Stu Harvey
// Happy Birthday Paul.
// No engines. Just code. HTML5 Canvas.

var canvas;
var ctx;
var gameLoopInterval;

// Game is based on these. ()
var width = 800;
var height = 600;
var canvasWidth = 800;
var canvasHeight = 600;

var level = 0;
var gameOver = false;
var endGameLength = 4; // how long after win the game keeps going

// The fps is actually 1000/ VVVV
var fps = 15;

// For currently moving
var RIGHT = 1;
var LEFT = 0;

//Your character!
var puppums = new Puppums();

// yum
var cake;

var sideScrollX = 0;
var sideScrollY = 0;

// the attributes of each level
var mapData;
var platforms = [];
var walls = [];
var lava = [];
// collisions are performed in Collisions.js

//half the time returns the val as negative
var getNegative  = function(toNegate) {
    if(Math.random() * 100 > 50)
        return - toNegate;
    else
        return toNegate;
}


var init = function() {
    canvas = document.getElementById('game_canvas');
    ctx = canvas.getContext('2d');

    ctx.canvas.width  = canvasWidth;
    ctx.canvas.height = canvasHeight;

    // local storage highscore
    if (localStorage.getItem("puppumsHighScorPLZDONTCHEATOMG")) {
        // there was a highscore! cool...
        highScore = localStorage.getItem("puppumsHighScorPLZDONTCHEATOMG");
        savedHighScore = localStorage.getItem("puppumsHighScorPLZDONTCHEATOMG");
    }

    // console.log("Canvas created, dimensions: " + width + "x" + height + " running at fps: " + (1000/fps));

    loadImages();
}

var startGame = function (mapID) {
    level = mapID;

    lastTime = Date.now();

    resetGame();

    MSGs.push(new msg(true, "Use arrow keys to control! Space to Jump!", width/2 - 100, height - puppums.height,1, "black"));

    // setTimeout(function() {
    //     MSGs[1] = new msg(true, "WATCH OUT!!!!", width - width/5, floorSize + puppums.width/2,1, "black");
    //     MSGs[2] = new msg(true, "WATCH OUT!!!!", width/10, floorSize + puppums.width/2,1, "black");
    // }, 2000);

    //start the game loop
    gameLoopInterval = setInterval(function () { gameLoop() }, fps);
}

var loadImages = function() {

}

var resetGame = function() {
    puppums = new Puppums();

    parts = []; // particles
    walls = [];
    platforms = [];
    lava = undefined;


    var newGameSizes = {
        width: width,
        height: height
    }
    var cakeData = {
        x: -1,
        y: -1
    }
    // right now auto loads a map (1)
    mapData = loadMap(level, walls, platforms, lava, newGameSizes, cakeData);
    width = newGameSizes.width;
    height = newGameSizes.height;

    if(cakeData.x == -1 && cakeData.y == -1) {
        console.log('ERROR::: MAKE SURE YOU SET CAKE X AND Y IN MAPBUILDER.');
    }

    cake = new Cake(cakeData.x, cakeData.y);
    gameOver = 0;
}

var gameLoop = function() {
    var currentTime = Date.now();

    var deltaTime = (currentTime - lastTime)/1000;

    if(deltaTime < 0.2) { //dont allow when they come out and into tab for one iteration (or when hella slow)
        if(gameOver > 0) {
            gameOver += deltaTime;

            // new level start
            if(gameOver > endGameLength) {
                level++;
                resetGame();
            }

            // end game slowmo
            deltaTime = deltaTime/10;
        }
        update(deltaTime);
    }

    render();

    lastTime = currentTime;
}

var endGameGoToMenu = function () {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    window.clearInterval(gameLoopInterval);
    gameLoopInterval = 0;

    loadMenu(LEVEL_CHOICE);
}

// The canvas drawing method
var render = function() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();

    //translate for the side scrolling XXXXX
    if(width != canvasWidth) {
        //check if player is near either side
        if(puppums.x <= canvasWidth/2) {
            sideScrollX = 0;
        }
        else if(puppums.x >= width - canvasWidth/2) {
            sideScrollX = width - canvasWidth;
        }
        else {
            sideScrollX = puppums.x - canvasWidth/2;
        }

        ctx.translate(-sideScrollX,0);
    }
    //translate for the side scrolling YYYYY
    if(height != canvasHeight) {
        //check if player is near either side
        if(puppums.y <= canvasHeight/2) {
            sideScrollY = 0;
        }
        else if(puppums.y >= height - canvasHeight/2) {
            sideScrollY = height - canvasHeight;
        }
        else {
            sideScrollY = puppums.y - canvasHeight/2;
        }
        ctx.translate(0,-sideScrollY);
    }

    drawMSGs(ctx);
    drawParts(ctx);
    if(gameOver == 0) {
        drawCake(ctx, cake);
    }
    drawPuppums(puppums);

    drawAllLava();
    drawPlatforms();
    drawWalls();

    ctx.restore();

    //console.log("DogX: " + puppums.xPos + "  -  " + puppums.yPos);

    // ctx.fillStyle = "rgb(0,0,0)";
    // ctx.fillRect(0, (height-floorSize), width, 4);
    // ctx.fillRect(0, (height-floorSize) + 8, width, 2);
    // ctx.fillRect(0, (height-floorSize) + 14, width, 1);

    // ctx.font="30px Oswald";
    // ctx.fillText("LEVEL: " + level, 2, 30);
}

//call all game updates
var update = function(delta) {
    checkCollisions(delta);

    updatePuppumsPos(delta);

    updateMSGs(delta);
    updateParts(delta);
    updateCake(delta, cake);
    
    updatePlatforms(delta);
}

var checkCollisions = function(delta) {
    // VV both in Collisions.js
    checkCollisionObjectWall(puppums, delta);
    checkCollisionObjectPlatform(puppums, delta);

    if(checkCollisionObjObj(puppums, cake, delta) && gameOver == 0) {
        // Cake is eaten
        console.log('Cake');

        // end the game
        gameOver = 1;

        // spawn celebratory particles
        var numberOfPartsToAdd = 60;
        for(i = 0; i < numberOfPartsToAdd; i++) {
            parts.push(new part(
                cake.x + Math.random()*cake.width, cake.y + Math.random()*cake.height, // x, y
                getNegative(Math.random() * maxPartSpeed), // xdir
                -(Math.random() * maxPartSpeed + minPartSpeed), // ydir
                // "rgb(" + Math.floor(Math.random()*250) + ", " + Math.floor(Math.random()*250) + ", " + Math.floor(Math.random()*250) + ")"); // color
                'rgb(11, 211, 24)')); // 209,238,252

            // parts.push(new part(
            //     cake.x + Math.random()*cake.width, cake.y + Math.random()*cake.height, // x, y
            //     getNegative(Math.random() * maxPartSpeed), // xdir
            //     -(Math.random() * maxPartSpeed + minPartSpeed), // ydir
            //     // "rgb(" + Math.floor(Math.random()*250) + ", " + Math.floor(Math.random()*250) + ", " + Math.floor(Math.random()*250) + ")"); // color
            //     'rgb(219,221,222)'));
            
            //console.log("New particle added xv: "+parts[k].xdir + " yv: "+parts[k].ydir);
        }
    }
}

var updatePlatforms = function(delta) {
    if(platforms != undefined) {
        for(var i = 0; i < platforms.length; i++) {
            updatePlatform(delta, platforms[i]);
        }
    }
}

var drawPlatforms = function() {
    if(platforms != undefined) {
        for(var i = 0; i < platforms.length; i++) {
            drawPlatform(ctx, platforms[i]);
        }
    }
}

var drawWalls = function() {
    if(walls != undefined) {
        for(var i = 0; i < walls.length; i++) {
            drawWall(ctx, walls[i]);
        }
    }
}

var drawAllLava = function() {
    if(lava != undefined) {
        for(var i = 0; i < lava.length; i++) {
           drawLava(ctx, lava[i], sideScrollX, sideScrollY);
        }
    }
}


//kill the dog and call the game reset
var killPup = function() {
    keepUpdating = false;

    if(savedHighScore < highScore) {
        localStorage.setItem("puppumsHighScorPLZDONTCHEATOMG", highScore);
    }

    setTimeout( function() {
        // particles for doggy death
        var numberOfPartsToAdd = 50;
        for(k = 0; k < numberOfParts; k++) {
            if(parts[k].alive == false) {
                numberOfPartsToAdd--;
                if(numberOfPartsToAdd == 0)
                    break;
                parts[k] = new part(true,
                    puppums.xPos + puppums.width/2 + Math.random()*getNegative(puppums.width/2),puppums.yPos - puppums.width/2 + Math.random()*getNegative(puppums.width/2),
                    getNegative(Math.random()*maxPartSpeed),
                    -(Math.random()*maxPartSpeed + minPartSpeed),
                    "black");
                parts[k].rotation = Math.random()*359.0;
                parts[k].rotationVelo = getNegative(Math.random()*359.0);

                //console.log("New particle added xv: "+parts[k].xdir + " yv: "+parts[k].ydir);
            }
        }

        puppums.xPos = -width;

        //start a new game
        setTimeout(function(){resetGame();},2000);
    }, 500);
}

window.addEventListener('keydown', this.keyPressed , false);

function keyPressed(e) {
    //document.getElementById("p1").innerHTML = "New text!";
    // console.log("Running");

    var key = e.keyCode;
    e.preventDefault();

    if(key == 37 || key == 65) { //left key
        puppums.left = true;
        puppums.facing = LEFT;
        puppums.right = false;
    }
    if(key == 39 || key == 68) { //right key
        puppums.right = true;
        puppums.facing = RIGHT;
        puppums.left = false;
    }
    if (key == 38 || key == 32) { // up or space
        puppums.space = true;
    }
}

window.addEventListener('keyup', this.keyReleased , false);

function keyReleased(e) {
    var upKey = e.keyCode;
    e.preventDefault();

    if(upKey == 37 || upKey == 65) { //left key
        puppums.left = false;
    }
    if(upKey == 39 || upKey == 68) { //right key
        puppums.right = false;
    }

    if(upKey == 32 || upKey == 38) { // up or space
        puppums.space = false;
        //space
    }

    if(upKey == 27) { // Esc
        endGameGoToMenu();
    }
}
