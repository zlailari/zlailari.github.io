// basic wall things and stuff
var Wall = function (xPos, yPos, width, height) {
    this.x = xPos;
    this.y = yPos;
    this.width = width;
    this.height = height;

    this.ID = -1;
    this.color = "rgb(0,0,0)"; //default black player color
}

/** Returns whether or not obj is near a wall
	@param obj The object to test
		PRE: obj has attributes x, y, w || width, h || height, and obj is
			 not super huge
	@param {int} [maxRadius=200] The largest distance (by Euclidean norm) at 
					which wall.near will return true
	@return true if wall is within maxRadius of obj,
			false otherwise
*/
Wall.prototype.near = function(obj, maxRadius) {
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

	// when wall is taller than it is wide, we check values along the vertical
	if (this.width <= this.height) {
		if (this.height > checkDist)
			pointsToCheck = Math.floor(this.height/checkDist);

		var objPt = {
			x: (x+w)/2,
			y: (y+h)/2
		}
		isNear = true;
		for (var i = 0; i < pointsToCheck; i++) {
			var wallPt = {
				x: (this.x + this.width/2),
				y: this.y + (this.height/pointsToCheck)*i
			}
			var dist = Math.pow(Math.pow(wallPt.x-objPt.x, 2)+Math.pow(wallPt.y-objPt.y, 2), .5);
			isNear = isNear || dist <= maxRadius;
		}
	}
	// since wall is wider than it is tall, check along horizontal
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
drawWall = function(ctx, wall) {
    ctx.fillStyle = wall.color;
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
}

//update
updateWall = function(delta, wall) {
}
