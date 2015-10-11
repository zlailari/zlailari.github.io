// basic platform things and stuff
var Platform = function (xPos, yPos, width, height, moveHori, moveVert, isSolid, partOfWall, xMovingPlat, yMovingPlat) {
    this.x = xPos;
    this.y = yPos;

    this.width = width;
    this.height = height;

    this.xDir = 0;
    this.yDir = 0;

    this.xMax = 0;
    this.xMin = 0;

    this.yMax = 0;
    this.yMin = 0;

    this.image = undefined;

    // default to false - optional call new Platform(x, y, w, h);
    if(moveHori == null && moveVert == null && isSolid == null && partOfWall == null && xMovingPlat == null && yMovingPlat == null) {
        moveHori = false;
        moveVert = false;
        isSolid = false;
        partOfWall = false;
    }

    this.solid = isSolid ? true : false;

    //moving platforms
    if(moveHori && xMovingPlat == null){
        this.horz = true;
        this.xDir = 50;
        this.xMax = this.x + 200;
        this.xMin = this.x;
    }
    else if (moveHori && xMovingPlat) {
        this.horz = true;
        this.xDir = xMovingPlat.velocity;
        if (this.xDir < 0) {
            this.xMin = this.x - xMovingPlat.travelDistance;
            this.xMax = this.x;
        }
        else {
            this.xMax = this.x + xMovingPlat.travelDistance;
            this.xMin = this.x;
        }
    }
    else
        this.horz = false;

    if(moveVert && !yMovingPlat){
        this.vert = true;
        this.yDir = -300;
        this.yMax = this.y - 1999;
        this.yMin = this.y;
    }
    else if (moveVert && yMovingPlat) {
        this.vert = true;
        this.yDir = -yMovingPlat.velocity;
        if (this.yDir > 0) {
            this.yMin = this.y + yMovingPlat.travelDistance;
            this.yMax = this.y;
        }
        else {    
            this.yMax = this.y - yMovingPlat.travelDistance;
            this.yMin = this.y;
        }
    }
    else
        this.vert = false;

    this.ID = -1;

    if(partOfWall)
        this.partOfWall = true;
    else
        this.partOfWall = false;

    if(!this.solid && !this.partOfWall)
        this.color = "rgb(100,100,100)";
    else
        this.color = "rgb(0,0,0)"; //default black player color
}

/** Returns whether or not obj is near a plat
    @param obj The object to test
        PRE: obj has attributes x, y, w || width, h || height, and obj is
             not super huge
    @param {int} [maxRadius=200] The largest distance (by Euclidean norm) at 
                    which plat.near will return true
    @return true if plat is within maxRadius of obj,
            false otherwise
*/
Platform.prototype.near = function(obj, maxRadius) {
    // set maxRadius if not provided
    if (maxRadius == undefined){
        maxRadius = 200;
    }

    var x, y, w, h;
    x = obj.x;
    y = obj.y;
    // width of obj can be obj.width or obj.w, height similarly
    w = (obj.width == undefined) ? obj.w : obj.width;
    h = (obj.height == undefined) ? obj.h : obj.height; 

    var pointsToCheck = 3;
    var checkDist = maxRadius/2;
    var isNear = false;

    // when plat is taller than it is wide, we check values along the vertical
    if (this.width <= this.height) {
        if (this.height > checkDist)
            pointsToCheck = Math.floor(this.height/checkDist);

        var objPt = {
            x: (x + w) / 2,
            y: (y + h) / 2
        }
        isNear = true;
        for (var i = 0; i < pointsToCheck; i++) {
            var wallPt = {
                x: (this.x + this.width / 2),
                y: this.y + (this.height / pointsToCheck) * i
            };
            var dist = Math.pow(Math.pow(wallPt.x-objPt.x, 2)+Math.pow(wallPt.y-objPt.y, 2), .5);
            isNear = isNear || dist <= maxRadius;
        }
    }
    // since plat is wider than it is tall, check along horizontal
    else {
        if (this.width > checkDist)
            pointsToCheck = Math.floor(this.width/checkDist);

        var objPt = {
            x: (x+w)/2,
            y: (y+h)/2
        }
        isNear = true;
        for (var i = 0; i < pointsToCheck; i++) {
            var wallPt = {
                x: this.x + (this.width/pointsToCheck)*i,
                y: this.y + this.height/2
            }
            var dist = Math.pow(Math.pow(wallPt.x-objPt.x, 2)+Math.pow(wallPt.y-objPt.y, 2), .5);
            isNear = isNear || dist <= maxRadius;
        }
    }
    return isNear;
}

//draw
// ^ gr8 comments
drawPlatform = function(ctx, platform) {
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
}

//update
// ^ gr8 comments x2
updatePlatform = function(delta, platform) {
    if(platform.xDir != 0){
        if(platform.x < platform.xMin){
            platform.xDir *= -1;
            platform.x = platform.xMin;
        }
        else if(platform.x > platform.xMax){
            platform.xDir *= -1;
            platform.x = platform.xMax;
        }
    }
    if(platform.yDir != 0){
        if(platform.y > platform.yMin){
            platform.yDir *= -1;
            platform.y = platform.yMin;
        }
        else if(platform.y < platform.yMax){
            platform.yDir *= -1;
            platform.y = platform.yMax;
        }
    }

    //update player positions
    platform.x += platform.xDir * delta;
    platform.y += platform.yDir * delta;

}
