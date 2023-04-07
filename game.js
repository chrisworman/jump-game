import { Platforms } from "./platforms.js";
import { GameState } from "./gameState.js";
import { Player } from "./player.js";
import { RenderContext } from "./renderContext.js";
import { UserControls } from "./userControls.js";
import { rectanglesOverlap } from "./utils.js";
import { LevelManager } from "./levelManager.js";

export class Game {
	static GRAVITY = 0.3;
	static PLAYER_JUMP_SPEED = -8;
	static PLAYER_RUNNING_SPEED = 5;
	static COLLECTABLE_COUNT = 10;
    static LEVEL_SCROLL_SPEED = 8;

	constructor() {
        // DOM
		this.debug = document.getElementById("debug");
        this.textOverlay = document.getElementById("textOverlay");
        this.scoreDisplay = document.getElementById("score");
		this.highScoreDisplay = document.getElementById("high-score");
		this.canvas = document.getElementById("canvas");

        // State
		this.state = GameState.PLAYING;
		this.highScore = 0;
		this.animatingLevelComplete = false;
		this.score = 0;
		this.canvasContext = canvas.getContext("2d");
		this.userControls = new UserControls();
		this.player = new Player(
			this.canvas.width,
			this.canvas.height,
			Game.GRAVITY,
			Game.PLAYER_JUMP_SPEED,
			Game.PLAYER_RUNNING_SPEED,
			this.userControls
		);
		this.levelManager = new LevelManager(this.canvas, this.player);
        this.renderContext = new RenderContext(this.canvas);
	}

	start() {
        this.level = this.levelManager.getNextLevel();
        this.textOverlay.innerText = `Level ${this.levelManager.levelNumber}`;
        setTimeout(() => { $(this.textOverlay).fadeOut('slow'); }, 2000);
        this.platforms = new Platforms(this.state, this.level.platformSprite);
		this.collectables = this.level.spawnCollectables();
        this.enemies = this.level.spawnInitialEnemies();
		this.userControls.enable();
		this.gameLoop();
	}

	gameLoop() {
		this.update();
		this.render();
		requestAnimationFrame(this.gameLoop.bind(this));
	}

	update() {
		if (this.state === GameState.GAME_OVER) {
			return;
		}

		this.player.update(this.state);
        this.platforms.update(this.state);

		// Level transition?
		if (this.state === GameState.LEVEL_TRANSITION ) {
            if (this.player.y + this.player.height >= this.canvas.height) { // Done transitioning
                $(this.textOverlay).fadeOut('slow');
                this.platforms.currentSprite = this.level.platformSprite;
                this.player.handleLevelTransitionDone();
                this.collectables = this.level.spawnCollectables();
                this.enemies = this.level.spawnInitialEnemies();
                this.state = GameState.PLAYING;
                return;
            }
		}

		// Update other entities
		this.enemies.forEach((x) => x.update());
		this.player.update();
		this.collectables.forEach((x) =>
			x.update(this.player, (points) => {
				this.score += points;
			})
		);

		// Check level end condition
		if (this.player.y + this.player.height <= 0) { // END OF LEVEL
            this.level = this.levelManager.getNextLevel();
            this.textOverlay.innerText = `Level ${this.levelManager.levelNumber}`;
            $(this.textOverlay).fadeIn('slow');
            this.platforms.nextSprite = this.level.platformSprite;
			this.state = GameState.LEVEL_TRANSITION;
			this.collectables = [];
			this.player.handelLevelComplete(); 
			return;
		}

		// Check enemy collisions
		for (let enemy of this.enemies) {
			if (rectanglesOverlap(this.player, enemy)) {
				this.player.handleGameOver();
				this.highScore =
					this.score > this.highScore ? this.score : this.highScore;
				this.state = GameState.GAME_OVER;
				return;
			}
		}

		// Spawn enemies
        this.level.spawnEnemies(this.enemies);
	}

	restart() {
		this.gameOver = false;
		this.score = 0;
		this.start();
	}

	render() {
        // DOM
		this.scoreDisplay.innerText = this.score;
		this.highScoreDisplay.innerText = this.highScore;
		this.debug.innerText = this.state;
        // Canvas
		this.platforms.render(this.renderContext);
		this.collectables.forEach((x) => x.render(this.renderContext));
		this.enemies.forEach((x) => x.render(this.renderContext));
		this.player.render(this.renderContext);
	}
}

var game = new Game();
game.start();
