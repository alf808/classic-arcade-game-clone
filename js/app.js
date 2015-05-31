//some globals
var canvaswidth = 505; //ctx.canvas.width
var charSelected; // to track if a player sprite has been selected
//some common x and y positions for player
var fifthRowPos = (83 * 4) - 8; // on 5th row up 8 on y axis for cosmetic reasons
var fifthColPos = 101 * 4; // on 5th column

var Sprite = function (x, y) {
		this.width = 101; // how do you get images dimensions?
		this.height = 171;
		// put image off screen if x and y not defined
		if (x || x === 0) {
				this.x = x;
		} else {
				this.x = -this.width;
		}
		if (y || y === 0) {
				this.y = y;
		} else {
				this.y = -this.height;
		}
};


// Enemies our player must avoid
var Enemy = function(y,pos) {
		// Variables applied to each of our instances go here,
		// we've provided one for you to get started
		this.moveBy = pos;
		// The image/sprite for our enemies, this uses
		// a helper we've provided to easily load images
		this.sprite = 'images/enemy-bug.png';
		this.y = y;
		Sprite.call(this, this.x, this.y);
		this.whereAreMyBounds();
		checkCollisions(this);
};

Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
		// You should multiply any movement by the dt parameter
		// which will ensure the game runs at the same speed for
		// all computers.
		this.x = this.x + (this.moveBy * dt);
		if (this.x >= canvaswidth) { this.x = -this.width; }
		this.whereAreMyBounds();
		checkCollisions(this);
};

Enemy.prototype.whereAreMyBounds = function () {
	this.left = this.x + (this.width - 90);// 90 is approx left x rel to width;
	this.right = this.x + (this.width - 13);//this.x + (this.width-(this.width/2));
	this.up = this.y + (this.height - 81); // 81 is approx upper y rel to height
	this.down = this.y + (this.height - 36);//135 is approx rel height;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
		this.whichCharacter = 5;
		this.selectChar = [
				'images/char-boy.png',
				'images/char-cat-girl.png',
				'images/char-horn-girl.png',
				'images/char-pink-girl.png',
				'images/char-princess-girl.png',
				'images/char-empty.png'
		];
		this.numberOfLives = 3;
		Sprite.call(this);
		this.sprite = this.selectChar[this.whichCharacter];
		this.x = canvaswidth / 2 - this.width / 2;
		this.y = fifthRowPos;
		this.whereAreMyBounds();
};

Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function() {
			this.x = this.x;
			this.y = this.y;
			this.whereAreMyBounds();
};

Player.prototype.whereAreMyBounds = function () {
	this.left = this.x + (this.width/2);//25.25 this.x + (this.width/2)
	this.right = this.x + (this.width-(this.width/2));// 75.75
	this.up = this.y + (this.height - 98);//98 is approx of upper y rel to height;
	this.down = this.y + (this.height - 40);// 40 is approx of lower y rel to height
};

Player.prototype.render = function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		displayGameStatus();
};

Player.prototype.handleInput = function(keyPress) {
	if (keyPress) {
		// if a player is NOT selected allow keyPress 1 2 3 4 5 only
		// keyPress==1||keyPress==2||keyPress==3||keyPress==4||keyPress==5
		if (!charSelected) {
			if (keyPress >= 1 || keyPress <= 5) {
				this.whichCharacter = keyPress - 1;
				this.sprite = this.selectChar[this.whichCharacter]; // select img from array
				charSelected = true;
			}
		}
		if (keyPress == 'left') {
				this.x -= 101;
		}
		if (keyPress == 'up') {
				this.y -= 83;
		}
		if (keyPress == 'right') {
				this.x += 101;
		}
		if (keyPress == 'down') {
				this.y += 83;
		}
		// console.log('keyPress is: ' + keyPress);
		// console.log('char is: ' + charSelected);
	}
};

var displayGameStatus = function() {
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,canvaswidth,22);
	ctx.fillStyle = 'black';
	ctx.font = '20px bold Arial';
	ctx.textAlign = 'center';
	ctx.fillText('Level:  ' + difficultyLevel + ',  Score:  ' + score + ',  Lives:  ' + player.numberOfLives, ctx.canvas.width / 2, 20);
	ctx.restore();
	if (charSelected) {
		// clear the GAME OVER message when new game begins
		ctx.clearRect(0,22,canvaswidth,21);
	}
};

//ene.left < player.right && ene.right > player.left && ene.top < player.bottom
// && ene.bottom > player.top
var checkCollisions = function(ene) {

	if (player.down >= ene.up &&
			player.left <= ene.right &&
			player.up <= ene.down &&
			player.right >= ene.left)
			{
				// collision occurred; subtract 1 life from players lives
				console.log('collided');
				player.numberOfLives -= 1;

				// start again at original position if collision occurs
				if (player.numberOfLives > 0) {
					player.x = canvaswidth / 2 - player.width / 2;
					player.y = fifthRowPos;
				} else {
					// GAME OVER display
					ctx.save();
					ctx.fillStyle = 'white';
					ctx.fillRect(0,22,canvaswidth,21);
					ctx.fillStyle = 'red';
					ctx.font = '20px bold Arial';
					ctx.textAlign = 'center';
					ctx.fillText('GAME OVER!!  Final Score:  ' + score + ',   Reached Level:  ' + difficultyLevel, ctx.canvas.width / 2, 43);
					ctx.restore();

					// initialize variables for new game
					score = 0;
					difficultyLevel = 1;
					allEnemies.length = 0;
					player = new Player();
					charSelected = false;
					drawAllEnemies(difficultyLevel);
				}

			}
			// for debugging collision states
			// else { console.log('ok'); }

// check if player made it to water which means VICTORY, point scored
	if (player.y <= 0) {
		console.log('you scored');

		player.x = canvaswidth / 2 - player.width / 2;
		player.y = fifthRowPos;
		difficultyLevel += 1;
		score += 100 * difficultyLevel; // score bigger as difficultyLevel increases
		drawAllEnemies(difficultyLevel);
	}

// check if player is going beyond canvas width and below starting point
			if (player.y > fifthRowPos) {
				player.y = fifthRowPos;
			}

			if (player.x > fifthColPos) {
				player.x = fifthColPos;
			}

			if (player.x < 1) {
				player.x = 0;
			}
};

var drawAllEnemies = function(numOfEnemies) {
	allEnemies.length = 0;
	// enemy below takes 2 arguments: the Row position, and the Movement pace
	// draw enemy in any of the 3 rows randomly. Speed is randomized steps along x-axis
	// Up 20 on y-axis for cosmetic reasons. Added 50 to speed thru trial and error
	for (var i=0; i < numOfEnemies; i++) {
		var enemy = new Enemy((Math.floor(Math.random() * 3)+1) * 83-20,(Math.random() * 3 * 50) + 50);
		allEnemies.push(enemy);
	}
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var score = 0;
var difficultyLevel = 1;
var player = new Player();
var allEnemies = [];
drawAllEnemies(difficultyLevel);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
		var allowedKeys = {
				49: 1,
				50: 2,
				51: 3,
				52: 4,
				53: 5
		};
		// as soon as player is selected allow arrow keys
		if (charSelected) {
			allowedKeys = {
				37: 'left',
				38: 'up',
				39: 'right',
				40: 'down'
			};
		}
		player.handleInput(allowedKeys[e.keyCode]);
});
