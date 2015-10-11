/*

The class for the end game cake

*/

// speed of cake bobbing
const bobSpeed = 20;

// The cake has a fixed bounding box, but a bouncing image with a smaller height
const cakeSize = 20;
const totalCakeHeight = 36;

var cakeImage;
cakeImage = new Image(); 
cakeImage.src = "game/pics/Cake.png";

var Cake = function (xPos, yPos) {
	this.x = xPos;
	this.y = yPos;

	this.cakeY = yPos;
	this.cakeYDir = bobSpeed;

	// for package landing on plarforms
	this.xDirExternal = 0;
	this.yDirExternal = 0;

	this.yDir = 0;
	this.xDir = 0;

	//set size to box for ammo / hp
	this.width = cakeSize;
	this.height = totalCakeHeight;
}

drawCake = function(ctx, cake) {
	// draw the yumms
	ctx.drawImage(cakeImage, cake.x, cake.cakeY, cakeSize, cakeSize);
}

updateCake = function(delta, cake) {

	// Bob the cake up and down
	if(cake.cakeYDir > 0 && cake.cakeY + (cake.cakeYDir*delta) + cakeSize > cake.y + totalCakeHeight) {
		cake.cakeYDir = -cake.cakeYDir;
	}
	else if(cake.cakeYDir < 0 && cake.cakeY + (cake.cakeYDir*delta) < cake.y) {
		cake.cakeYDir = -cake.cakeYDir;
	}

	cake.cakeY += cake.cakeYDir * delta;

	// update the cake position
	cake.y += ((cake.yDir*delta) + (cake.yDirExternal*delta));
	cake.x += ((cake.xDir*delta) + (cake.xDirExternal*delta));
}