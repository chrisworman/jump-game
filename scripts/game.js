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
import { Hud } from "./hud.js";

export class Game {
	static GRAVITY = 0.3;
	static LEVEL_SCROLL_SPEED = 8;
	static MAX_PLAYER_HEALTH = 3;

	constructor() {
		this.state = GameState.INITIALIZING;

		SpriteLibrary.preloadImages();

		this.canvas = document.getElementById("canvas");
		this.hud = new Hud(this);
		this.userControls = new UserControls(this);
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

		this.setScore(0);
		this.hud.textOverlayFadeIn("Blobby the Jumper");
		this.hud.showStartButton();
		this.gameLoop();
	}

	// Figure out DRYer constructor / start / restart

	// start() {
	// 	// Start intro animations
	// 	this.hud.textOverlayFadeOut(`${this.level.world.title} - ${this.level.title}`);
	// 	this.filterManager.animate((amountDone) => {
	// 		this.filterManager.blurPixels = 10 - 10 * amountDone;
	// 		this.filterManager.brightnessPercent = 100 * amountDone;
	// 	}, 1000);

	// 	// Prepare the entities for the level
	// 	this.collectables = this.level.spawnCollectables();
	// 	this.enemies = this.level.spawnInitialEnemies();

	// 	// Let's go!
	// 	this.state = GameState.PLAYING;
	// 	// this.audioManager.play(AudioManager.AUDIO_FILES.BACKGROUND_SONG, true);
	// 	// this.gameLoop();
	// }

	startNewGame() {
		// Update state before UI
		this.levelManager.reset();
		this.level = this.levelManager.getNextLevel();
		this.player.reset();
		this.setScore(0);
		this.bullets = [];
		this.collectables = [];
		this.enemies = [];
		this.platforms = new Platforms(this);
		this.collectables = this.level.spawnCollectables();
		this.enemies = this.level.spawnInitialEnemies();

		// Update UI
		this.hud.textOverlayFadeOut(`${this.level.world.title} - ${this.level.title}`);
		this.filterManager.animate((amountDone) => {
			this.filterManager.blurPixels = 10 - 10 * amountDone;
			this.filterManager.brightnessPercent = 100 * amountDone;
		}, 1000);
		this.hud.hideStartButton();
		this.hud.hideRestartButton();

		this.audioManager.play(AudioManager.AUDIO_FILES.BACKGROUND_SONG, true);
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
		if (this.level.isComplete()) {
			this.handleLevelComplete();
			return;
		}

		// Update enemies
		this.enemies.forEach((enemy) => enemy.update());
		this.bullets.forEach((bullet) => bullet.update());
		this.collectables.forEach((x) => x.update());
		this.level.spawnEnemies();
	}

	updateLevelTransition() {
		this.player.update();
		this.platforms.update();

		// Has the player reached the bottom of the screen?
		if (this.player.y + this.player.height >= this.canvas.height) {
			// We are done transitioning
			this.hud.textOverlayFadeOut();
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
		this.hud.displayScore(score);
	}

	handlePlayerDead() {
		this.hud.textOverlayFadeIn("Game Over");
		this.hud.showRestartButton();
		this.filterManager.animate((amountDone) => {
			this.filterManager.blurPixels = amountDone * 8;
			this.filterManager.brightnessPercent = 100 - 50 * amountDone;
		}, 1000);
		this.state = GameState.GAME_OVER;
	}

	handleLevelComplete() {
		this.level = this.levelManager.getNextLevel();

		if (!this.level) {
			// Beat the game!
			this.hud.textOverlayFadeIn("You Beat the Game!");
			this.hud.showRestartButton();
			this.filterManager.animate((amountDone) => {
				this.filterManager.blurPixels = amountDone * 8;
				this.filterManager.brightnessPercent = 100 - 50 * amountDone;
			}, 1000);
			this.state = GameState.GAME_BEAT;
			return;
		}

		// Transition to next level
		this.hud.textOverlayFadeIn(`${this.level.world.title} - ${this.level.title}`);
		this.platforms.nextSprite = this.level.platformSprite;
		this.collectables = [];
		this.enemies = [];
		this.bullets = [];
		this.player.handelLevelComplete();
		this.state = GameState.LEVEL_TRANSITION;
	}

	toggleAudioMute() {
		if (this.audioManager) {
			if (this.audioManager.isMuted) {
				this.audioManager.unmute();
			} else {
				this.audioManager.mute();
			}
			this.hud.displayAudioMuted(this.audioManager.isMuted);
		}
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

new Game();