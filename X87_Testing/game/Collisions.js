/*

This class contains everything relating to collisions.

(It could be in Game.js but this is easier to section out)

*/


// collision between a moving object and platform
checkCollisionObjectPlatform = function(obj, delta){
    //console.log("Delta: " + delta);
    obj.xDirExternal = 0;
    obj.yDirExternal = 0;
    for(var i = 0; i < platforms.length; i++) {
        if (!platforms[i].near(obj))
            continue;
        // check to see if the objects velocity is big enough to push them through the object (fire extra collisions)
        // if(obj.yDir*delta > platforms[i].height && obj.yDir > 0)
        // try collisions with lower velocities to see if there should be a collision
        var yTestDir = 0;
        var yTestDirOG = platforms[i].height;
        var yTestDirUp = 0;
        if(obj.yDir >=0){
            do {
                if (obj.y + yTestDir + obj.height >= platforms[i].y &&
                    obj.y + yTestDir + obj.height <= platforms[i].y + platforms[i].height +4 &&
                    obj.x + obj.width >= platforms[i].x &&
                    obj.x <= platforms[i].x + platforms[i].width) {

                    if(obj.yDir >= 0) {
                        obj.yDir = 0;
                        obj.y = platforms[i].y - obj.height;
                        obj.floor = true;

                        //set xDirExternal when on moving platform
                        if(platforms[i].xDir != 0){
                            obj.xDirExternal = platforms[i].xDir;
                        }
                        else{
                            obj.xDirExternal=0;
                        }

                        //set xDirExternal when on moving platform
                        if(platforms[i].yDir != 0) {
                            obj.yDirExternal = platforms[i].yDir;
                        }
                        else {
                            obj.yDirExternal = 0;
                        }

                        if(platforms[i].vert && platforms[i].yDir < 0){
                            obj.onVertPlatformUp = true;
                        }
                        if(platforms[i].vert && platforms[i].yDir > 0){
                            obj.onVertPlatformDown = true;
                            //obj.yDirExternal = 0;
                            obj.y = platforms[i].y - obj.height +1 + platforms[i].yDir * delta;
                            //obj.y -= platforms[i].height;
                            obj.yDirExternal = platforms[i].yDir;
                            obj.floor = true;
                            //obj.yDirExternal = 0;
                        }


                        return true;
                    }

                }
                yTestDir += yTestDirOG;
            } while(yTestDir <= obj.yDir * delta);
        }
        obj.onVertPlatformDown = false;
        obj.onVertPlatformUp = false;

        //solid platforms (have cielings)
        if(platforms[i].solid && obj.yDir < 0) {
            do{
                if (obj.y + yTestDirUp + obj.height > platforms[i].y &&
                    obj.y + yTestDirUp <= platforms[i].y + platforms[i].height+4 &&
                    obj.x + obj.width >= platforms[i].x &&
                    obj.x <= platforms[i].x + platforms[i].width) {

                    if(obj.yDir < 0 && platforms[i].solid){
                        obj.yDir = 0;
                        //obj.y = platforms[i].y;// + platforms[i].height + 5;
                        obj.jetpack = false;
                        obj.up = false;
                        
                        if(obj.playerFall && obj.playerFall < 0){
                            obj.y = platforms[i].y + platforms[i].height+1;
                        }
                        
                        return true;
                    }
                }
                yTestDirUp -= yTestDirOG;
            } while(yTestDirUp >= obj.yDir * delta);
        }
    }
    return false;
}


checkCollisionObjectWall = function(obj, delta) {
    for(var i = 0; i < walls.length; i++) {
        if (!walls[i].near(obj))
            continue;
        // check to see if the objects velocity is big enough to push them through the object (fire extra collisions)
        // if(obj.yDir*delta > platforms[i].height && obj.yDir > 0)
        // try collisions with lower velocities to see if there should be a collision
        var xTestDir = 0;
        var xTestDirL = 0;
        var xTestDirOG = walls[i].width;
        if (walls[i].height > 10) {
            if(obj.xDir > 0 && obj.x + obj.width/2 < walls[i].x + walls[i].width/2) {
                do{
                    if (obj.y + obj.height >= walls[i].y &&
                        obj.y  <= walls[i].y + walls[i].height &&
                        obj.x + obj.width + xTestDir>= walls[i].x &&
                        obj.x + obj.width + xTestDir<= walls[i].x + walls[i].width){

                        obj.x = walls[i].x - obj.width;
                        obj.xDir = 0;
                        obj.atWall = true;
                        return true;
                    }
                    xTestDir += obj.xDir*delta/5;
                }
                while(xTestDir <= obj.xDir * delta);
            }
            else if(obj.xDir < 0 && obj.x + obj.width/2 > walls[i].x + walls[i].width/2){
                do{
                    if (obj.y + obj.height >= walls[i].y &&
                        obj.y  <= walls[i].y + walls[i].height &&
                        obj.x + xTestDirL>= walls[i].x &&
                        obj.x + xTestDirL<= walls[i].x + walls[i].width) {

                        obj.x = walls[i].x + walls[i].width;
                        obj.xDir = 0;
                        obj.atWall = true;
                        return true;
                    }
                    xTestDirL += obj.xDir*delta/5;
                }
                while(xTestDirL >= obj.xDir * delta);
            }
        }
    }
    return false;
}

// collision between two moving objects (bullet, player) (cake, pupps)
// each object needs an x, a y, width and height
var checkCollisionObjObj = function(obj, obj2, delta){
    if(Math.abs(obj.xDir * delta) >= obj2.width){
        var xTestDir = 0;
        var xTestDirL = 0;
        var xTestDirOG = obj2.width; //obj2.width / 2;
        if(obj.xDir > 0) {
            do{
                if (obj.y + obj.height >= obj2.y &&
                    obj.y  <= obj2.y + obj2.height &&
                    obj.x + obj.width + xTestDir>= obj2.x &&
                    obj.x + xTestDir <= obj2.x + obj2.width){

                    return true;
                }
                xTestDir += xTestDirOG/4;
            }
            while(xTestDir <= obj.xDir * delta + obj2.width);
        }
        else if(obj.xDir < 0){
            do{
                if (obj.y + obj.height >= obj2.y &&
                    obj.y  <= obj2.y + obj2.height &&
                    obj.x + obj.width + xTestDirL>= obj2.x &&
                    obj.x + xTestDirL<= obj2.x + obj2.width) {

                    return true;
                }
                xTestDirL -= xTestDirOG/4;
            }
            while(xTestDirL >= obj.xDir * delta - obj2.width);
        }
    }
    else{
        return (obj.y + obj.yDir * delta + obj.height >= obj2.y + obj2.yDir * delta &&
                obj.y + obj.yDir * delta <= obj2.y + obj2.yDir * delta + obj2.height &&
                obj.x + obj.xDir * delta + obj.width >= obj2.x + obj2.xDir * delta &&
                obj.x + obj.xDir * delta <= obj2.x + obj2.xDir * delta + obj2.width);
    }

    return false;
}


allCollisions = function(delta) {
    // player-lava collision
    for(var i = 0; i < lava.length; i++){
        if(puppums.health > 0 && checkCollision(puppums,lava[i])){
            puppums.health -= 340;
            if (puppums.health <= 0) {
              //gives the player the kill who hit last (if someone just hit them)
              if (puppums.lastPlayerToHit != -1 && puppums.lastPlayerToHit != undefined) {
                recordKillStats(players[puppums.lastPlayerToHit], puppums);

                if(isClient == false) {
                  // make the new collision data to send to clients
                  var newCollisionData = {
                    someoneDied: true,
                    shooter: puppums.lastPlayerToHit,
                    playerShot: k,
                    type: 3 //type 3 for that lava!
                  }

                  collisionData.push(newCollisionData);
                }
                else {
                  //console.log("Lava kill yo!");
                  addKillFeed(players[puppums.lastPlayerToHit], puppums, true);
                }
              }
              else {
                puppums.deaths++;
                puppums.killStreak = 0;
              }

              if(currentGameMode != Survival){
                respawnPlayer(puppums, gameWidth, gameHeight);
              }
            }
            else {
                puppums.y = lava[i].y - puppums.height-1;
                puppums.yDir = -puppums.yDir;
                puppums.yDir /= 1.5;
            }
        }
    }
}