import { Platforms } from "./platforms.js";
import { GameState } from "./gameState.js";
import { Player } from "./player.js";
import { RenderContext } from "./renderContext.js";
import { UserControls } from "./userControls.js";
import { LevelManager } from "./levelManager.js";
import { FilterManager } from "./filterManager.js";
import { AudioManager } from "./audioManager.js";
import { EnemyTypes } from "./enemyTypes.js";
import { SpriteLibrary } from "./spriteLibrary.js";

export class Game {
	static GRAVITY = 0.3;
	static COLLECTABLE_COUNT = 10;
	static LEVEL_SCROLL_SPEED = 8;

	constructor() {
		// Immediately pre-load images
		SpriteLibrary.preloadImages();

		// DOM
		this.heartsDisplay = document.getElementById("hearts");
		this.textOverlay = document.getElementById("textOverlay");
		this.scoreDisplay = document.getElementById("score");
		this.canvas = document.getElementById("canvas");
		this.restartButton = document.getElementById("restartButton");
		this.restartButton.addEventListener("click", () => {
			this.restart();
		});

		// State
		this.state = GameState.INITIALIZING;
		this.setScore(0);
		this.userControls = new UserControls();
		this.audioManager = new AudioManager();
		this.player = new Player(this);
		this.levelManager = new LevelManager(this);
		this.level = this.levelManager.getNextLevel();
		this.renderContext = new RenderContext(this.canvas);
		this.filterManager = new FilterManager();
		this.platforms = new Platforms(this);
		this.bullets = [];
		this.collectables = [];
		this.enemies = [];
	}

	// Figure out DRYer constructor / start / restart

	start() {
		// Start intro animations
		this.fadeOutTextOverlay(`Level ${this.levelManager.levelNumber}`);
		this.filterManager.animate((amountDone) => {
			this.filterManager.blurPixels = 10 - 10 * amountDone;
			this.filterManager.brightnessPercent = 100 * amountDone;
		}, 1000);

		// Prepare the entities for the level
		this.collectables = this.level.spawnCollectables();
		this.enemies = this.level.spawnInitialEnemies();
		
		// Let's go!
		this.state = GameState.PLAYING;
		this.gameLoop();
	}

	restart() {
		$(this.restartButton).fadeOut("slow");
		this.player.reset();
		this.setScore(0);
		this.bullets = [];
		this.collectables = [];
		this.enemies = [];
		this.levelManager = new LevelManager(this);
		this.level = this.levelManager.getNextLevel();
		this.platforms = new Platforms(this);

		// Start intro animations
		this.fadeOutTextOverlay(`Level ${this.levelManager.levelNumber}`);
		this.filterManager.animate((amountDone) => {
			this.filterManager.blurPixels = 10 - 10 * amountDone;
			this.filterManager.brightnessPercent = 100 * amountDone;
		}, 1000);

		// Prepare the entities for the level
		this.collectables = this.level.spawnCollectables();
		this.enemies = this.level.spawnInitialEnemies();

		this.state = GameState.PLAYING;
	}

	gameLoop() {
		this.update();
		this.render();
		requestAnimationFrame(this.gameLoop.bind(this));
	}

	update() {
		switch (this.state) {
			case GameState.PLAYING:
				this.updatePlaying();
				break;
			case GameState.LEVEL_TRANSITION:
				this.updateLevelTransition();
				break;
		}
	}

	updatePlaying() {
		this.player.update();
		this.platforms.update();

		// Player dead?
		if (this.player.health === 0) {
			this.handlePlayerDead();
			return;
		}

		// Level complete?
		if (this.player.y + this.player.height <= 0) {
			this.handleLevelComplete();
			return;
		}

		this.enemies.forEach((enemy) => enemy.update());
		this.enemies = this.enemies.filter((x) => !x.isOffScreen);

		this.bullets.forEach((bullet) => bullet.update());
		this.bullets = this.bullets.filter((x) => !x.isOffScreen && !x.hitEnemy);
		this.enemies = this.enemies.filter((x) => !x.isDead);

		this.collectables.forEach((x) => x.update());

		this.level.spawnEnemies();
	}

	updateLevelTransition() {
		this.player.update();
		this.platforms.update();

		// Has the player reached the bottom of the screen?
		if (this.player.y + this.player.height >= this.canvas.height) { // We are done transitioning
			$(this.textOverlay).fadeOut("slow");
			this.platforms.currentSprite = this.level.platformSprite;
			this.player.handleLevelTransitionDone();
			this.collectables = this.level.spawnCollectables();
			this.enemies = this.level.spawnInitialEnemies();
			this.state = GameState.PLAYING;
		}
	}

	incrementScore(points) {
		this.setScore(this.score + points);
	}

	setScore(score) {
		this.score = score;
		this.scoreDisplay.innerText = String(this.score).padStart(6, "0");
	}

	handlePlayerDead() {
		this.fadeInTextOverlay('Game Over');
		$(this.restartButton).fadeIn("slow");
		this.filterManager.animate((amountDone) => {
			this.filterManager.blurPixels = amountDone * 8;
			this.filterManager.brightnessPercent =
				100 - 50 * amountDone;
		}, 1000);
		this.state = GameState.GAME_OVER;
	}

	handleLevelComplete() {
		this.level = this.levelManager.getNextLevel();
		this.fadeInTextOverlay(`Level ${this.levelManager.levelNumber}`);
		this.platforms.nextSprite = this.level.platformSprite;
		this.collectables = [];
		this.enemies = [];
		this.bullets = [];
		this.player.handelLevelComplete();
		this.state = GameState.LEVEL_TRANSITION;
	}

	fadeInTextOverlay(text) {
		this.textOverlay.innerText = text;
		$(this.textOverlay).fadeIn("slow");
	}

	fadeOutTextOverlay(text) {
		this.textOverlay.innerText = text;
		setTimeout(() => {
			$(this.textOverlay).fadeOut("slow");
		}, 2000);
	}

	render() {
		const ctx = this.renderContext.getCanvasContext();
		this.filterManager.applyFilters(ctx, () => {
			this.platforms.render(this.renderContext);
			this.enemies
				.filter((x) => x.enemyType == EnemyTypes.WALKER)
				.forEach((x) => x.render(this.renderContext));
			this.player.render(this.renderContext);
			this.bullets.forEach((x) => x.render(this.renderContext));
			this.collectables.forEach((x) => x.render(this.renderContext));
			this.enemies
				.filter((x) => x.enemyType == EnemyTypes.FIRE_BALL)
				.forEach((x) => x.render(this.renderContext));
		});
	}
}

var game = new Game();
game.start();
