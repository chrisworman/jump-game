import { Platforms } from "./platforms.js";
import { GameState } from "./gameState.js";
import { Player } from "./player.js";
import { RenderContext } from "./renderContext.js";
import { UserControls } from "./userControls.js";
import { rectanglesOverlap } from "./utils.js";
import { LevelManager } from "./levelManager.js";
import { FilterManager } from "./filterManager.js";
import { AudioManager } from "./audioManager.js";

export class Game {
	static GRAVITY = 0.3;
	static COLLECTABLE_COUNT = 10;
	static LEVEL_SCROLL_SPEED = 8;

	constructor() {
		// DOM
		this.heartsDisplay = document.getElementById("hearts");
		this.textOverlay = document.getElementById("textOverlay");
		this.scoreDisplay = document.getElementById("score");
		this.canvas = document.getElementById("canvas");

		// State
		this.state = GameState.PLAYING;
		this.animatingLevelComplete = false;
		this.setScore(0);
		this.canvasContext = canvas.getContext("2d");
		this.userControls = new UserControls();
		this.audioManager = new AudioManager();
		this.audioManager.load('collected', 'collected.mp3');
		this.player = new Player(
			this.canvas.width,
			this.canvas.height,
			Game.GRAVITY,
			this.userControls,
			this.audioManager,
		);
		this.setPlayerHealth(3);
		this.levelManager = new LevelManager(this.canvas, this.player);
		this.renderContext = new RenderContext(this.canvas);
		this.bullets = [];
		this.collectables = [];
		this.platforms = [];
		this.enemies = [];
		this.level = null;
		this.filterManager = new FilterManager();
		
	}

	start() {
		this.hueAngle = 0;
		this.level = this.levelManager.getNextLevel();
		this.textOverlay.innerText = `Level ${this.levelManager.levelNumber}`;
		setTimeout(() => {
			$(this.textOverlay).fadeOut("slow");
		}, 2000);
		this.platforms = new Platforms(this.state, this.level.platformSprite);
		this.collectables = this.level.spawnCollectables();
		this.enemies = this.level.spawnInitialEnemies();
		this.userControls.enable();
		this.filterManager.animate((amountDone) => {
			this.filterManager.blurPixels = 10 - 10 * amountDone;
			this.filterManager.brightnessPercent = 100 * amountDone;
		}, 1000);
		this.gameLoop();
	}

	gameLoop() {
		this.update();
		this.render();
		requestAnimationFrame(this.gameLoop.bind(this));
	}

	/*

	Changes:

		Pass Game object insted of its properties

		Mark Don't Remove Stuff
		1. Mark enemies as isShot or isOffscreen
		2. Implement enemy.inPlay() => isShot && isOffscreen (also bullets)
		3. Only consider enemy.inPlay()
		4. Enemies don't render themselves if they are !inPlay
		5. Implement sprite.hide() and sprte.show() to help here
		6. Don't remove enemies or bullets from arrays, instead clear arrays at the end of a level

		Proper Enemies
		1. Rename enemy.js -> fireBall.js
		2. Create enemyTypes.js

		Health
		1. Current health (HTML!)
		2. Perfect level => +heart
		3. Getting hit => -heart && recovering flash
		
	*/

	update() {
		// this.hueAngle = this.hueAngle + 1 % 360;
		if (this.state === GameState.GAME_OVER) {
			return;
		}

		this.player.update(this.state, (bullet) => {
			this.bullets.push(bullet);
		});

		this.platforms.update(this.state);

		const offScreenBullets = [];
		this.bullets.forEach((bullet) => {
			bullet.update((bullet) => {
				offScreenBullets.push(bullet);
			});
		});
		this.bullets = this.bullets.filter(
			(x) => offScreenBullets.indexOf(x) < 0
		);

		// Level transition?
		if (this.state === GameState.LEVEL_TRANSITION) {
			if (this.player.y + this.player.height >= this.canvas.height) {
				// Done transitioning
				$(this.textOverlay).fadeOut("slow");
				this.platforms.currentSprite = this.level.platformSprite;
				this.player.handleLevelTransitionDone();
				this.collectables = this.level.spawnCollectables();
				this.enemies = this.level.spawnInitialEnemies();
				this.state = GameState.PLAYING;
			}
			return;
		}

		// Everything below will not be run during level transition

		// Update other entities
		const offScreenEnemies = [];
		this.enemies.forEach((x) =>
			x.update((offScreenEnemy) => {
				offScreenEnemies.push(offScreenEnemy);
			})
		);
		this.enemies = this.enemies.filter(
			(x) => offScreenEnemies.indexOf(x) < 0
		);

		this.collectables.forEach((x) =>
			x.update(this.player, (points) => {
				this.setScore(this.score + points);
				this.audioManager.play('collected');
			})
		);

		// Check level end condition
		if (this.player.y + this.player.height <= 0) {
			// END OF LEVEL
			this.level = this.levelManager.getNextLevel();
			this.textOverlay.innerText = `Level ${this.levelManager.levelNumber}`;
			$(this.textOverlay).fadeIn("slow");
			this.platforms.nextSprite = this.level.platformSprite;
			this.state = GameState.LEVEL_TRANSITION;
			this.collectables = [];
			this.enemies = [];
			this.player.handelLevelComplete();
			return;
		}

		// Check for shot walkers
		const spentBullets = [];
		if (this.bullets.length > 0) {
			const walkers = this.enemies.filter(
				(x) => x.enemyType === "walker" && !x.isShot
			);
			for (let walker of walkers) {
				for (let bullet of this.bullets) {
					if (rectanglesOverlap(walker, bullet)) {
						walker.isShot = true;
						spentBullets.push(bullet);
					}
				}
			}
		}

		// Remove spent bullets
		if (spentBullets.length > 0) {
			this.bullets = this.bullets.filter(
				(x) => spentBullets.indexOf(x) < 0
			);
		}

		// Remove dead enemies
		this.enemies = this.enemies.filter((x) => !x.isDead());

		// TODO: move to player
		// Check enemy collisions
		if (!this.player.recovering) {
			for (let enemy of this.enemies) {
				if (enemy.isShot) {
					continue;
				}
				if (rectanglesOverlap(this.player.getHitBox(), enemy)) {
					// Player hit an enemy!!
					if (this.player.health > 1) {
						this.setPlayerHealth(this.player.health - 1);
					} else {
						this.setPlayerHealth(0);
						this.player.handleGameOver();
						this.textOverlay.innerText = `Game Over`;
						$(this.textOverlay).fadeIn("slow");
						this.filterManager.animate((amountDone) => {
							this.filterManager.blurPixels = amountDone * 8;
							this.filterManager.brightnessPercent =
								100 - 50 * amountDone;
						}, 1000);
						this.state = GameState.GAME_OVER;
						return;
					}
				}
			}
		}

		// Spawn enemies
		this.level.spawnEnemies(this.enemies);
	}

	setScore(score) {
		this.score = score;
		this.scoreDisplay.innerText = String(this.score).padStart(6, "0");
	}

	setPlayerHealth(health) {
		// TODO: move to player
		// Reduction in health, but still alive?
		if (health > 0 && this.player.health > health) {
			this.player.recovering = true;
			this.player.recoveringStartTime = Date.now();
		}

		this.player.health = health;

		// Update display
		const heartsHtmlBuffer = [];
		for (let i = 0; i < this.player.health; i++) {
			heartsHtmlBuffer.push('<div class="heart"></div>');
		}
		for (let i = 0; i < 3 - this.player.health; i++) {
			heartsHtmlBuffer.push('<div class="heart-empty"></div>');
		}
		this.heartsDisplay.innerHTML = heartsHtmlBuffer.join("");
	}

	render() {
		const ctx = this.renderContext.getCanvasContext();
		this.filterManager.applyFilters(ctx, () => {
			this.platforms.render(this.renderContext);
			this.enemies
				.filter((x) => x.enemyType == "walker")
				.forEach((x) => x.render(this.renderContext));
			this.player.render(this.renderContext);
			this.bullets.forEach((x) => x.render(this.renderContext));
			this.collectables.forEach((x) => x.render(this.renderContext));
			this.enemies
				.filter((x) => x.enemyType == "fire-ball")
				.forEach((x) => x.render(this.renderContext));
		});
	}
}

var game = new Game();
game.start();
