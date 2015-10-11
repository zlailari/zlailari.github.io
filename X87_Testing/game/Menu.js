/* 

Menu.js

This contains the Menu managing for the game.

When a level is chosen it calls Game.js to start the game going.

*/

// ** Menu constants
var LEVEL_CHOICE = 1;
var IN_GAME = 2;

var gameLevelChoice = 0;

// fades out the current menu then calls to load the new one
var loadMenu = function(menuID) {
	$('.menu').fadeOut(250, 
		function() {
			changeMenu(menuID);
		}
	);
}

// Changes the menu to look like the menuID state
var changeMenu = function(menuID) {
	var menu = '';

	switch(menuID) {
		case LEVEL_CHOICE:
			console.log('Menu: Loading LEVEL choice');

			menu += '<h1>Choose your level:</h1>';
			menu += '<h2 class="hoverText">&nbsp;</h2>';
			menu += '<div class="levels">'
			menu += 	'<a class="level">1</a>';
			menu += 	'<a class="level">2</a>';
			menu += 	'<a class="level">3</a>';
			menu += 	'<a class="level">4</a>';
			menu += 	'<a class="level">5</a>';
			menu += '</div>'
			break;
		case IN_GAME:
			console.log('Menu: starting game on level: ' + gameLevelChoice);

			startGame(gameLevelChoice);
			break;
	}

	$('.menu').html(menu);
	$('.menu').fadeIn(250);

	$('.level').on('click', 
		function(event) {
			loadMenu(IN_GAME);
			gameLevelChoice = $(event.target).html()-1;
		}
	);

	$('.level').mouseover( 
		function(event) {
			var levelName = mapNames[$(event.target).html()-1];
			$('.hoverText').html(levelName);
		}
	);
	$('.level').mouseout( 
		function(event) {
			$('.hoverText').html("&nbsp;");
		}
	);
}

// On loading the dom start the level selection menu
$(document).ready(function() {
	loadMenu(LEVEL_CHOICE);
});
