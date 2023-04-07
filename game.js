import { Background } from "./background.js";
import { Collectable } from "./collectable.js";
import { GameState } from "./gameState.js";
import { Obstacle } from "./obstacle.js";
import { Player } from "./player.js";
import { RenderContext } from "./renderContext.js";
import { UserControls } from "./userControls.js";
import { rectanglesOverlap } from "./utils.js";

class Game {
	static GRAVITY = 0.3;
	static PLAYER_JUMP_SPEED = -8;
	static PLAYER_RUNNING_SPEED = 5;
	static BG_COLOR = "#B6D6FF";
	static COLLECTABLE_COUNT = 10;

	constructor() {
        this.debug = document.getElementById("debug");
        this.state = GameState.PLAYING;
        this.highScore = 0;
        this.animatingLevelComplete = false;
		this.score = 0;
		this.scoreDisplay = document.getElementById("score");
        this.highScoreDisplay = document.getElementById('high-score');
		this.canvas = document.getElementById("canvas");
		this.canvasContext = canvas.getContext("2d");
		this.background = new Background(Game.BG_COLOR);
        this.userControls = new UserControls();
		this.player = new Player(
			this.canvas.width,
			this.canvas.height,
			Game.GRAVITY,
			Game.PLAYER_JUMP_SPEED,
			Game.PLAYER_RUNNING_SPEED,
            this.userControls,
		);
		
	}

	start() {
        this.resetCollectablesAndObstacles();
		this.renderContext = new RenderContext(this.canvas);
		this.userControls.enable();
		this.gameLoop();
	}

	gameLoop() {
		this.update();
		this.render();
		requestAnimationFrame(this.gameLoop.bind(this));
	}

	update() {

        this.player.update(this.state);

        if (this.state === GameState.GAME_OVER) {
            return;
        }
        
        // Check if we are done animating level transition
        if (
            this.state === GameState.LEVEL_TRANSITION &&                // We are transitioning, and ...
            this.player.y + this.player.height >= this.canvas.height    // The player has hit the bottom!
        ) { 
			this.player.handleLevelTransitionDone();
            this.resetCollectablesAndObstacles();
            this.state = GameState.PLAYING;
            return;
		}

        // Update
		this.obstacles.forEach((x) => x.update());
		this.player.update();
        this.collectables.forEach((x) => x.update(this.player));

		// Check level end condition
		if (this.player.y + this.player.height <= 0) { // Player made it to the top!!
            this.state = GameState.LEVEL_TRANSITION;
            this.collectables = [];
            this.player.handelLevelComplete(8); // TODO: static LEVEL_SCROLL_SPEED = 8;
            return;
		}

        // Check obstacle collisions
        for (let obstacle of this.obstacles) {
            if (rectanglesOverlap(this.player, obstacle)) {
                this.player.jumping = false;
                this.highScore = this.score > this.highScore ? this.score : this.highScore;
                this.state = GameState.GAME_OVER;
                return;
            }
        }

        // Spawn obstacle
        if (this.obstacles.length < 2 && this.player.y <= this.canvas.height / 2) {
            this.obstacles.push(Obstacle.spawn(this.canvas.width, Game.GRAVITY));
        }
	}

    resetCollectablesAndObstacles() {
        // this.player.resetPosition();
        this.collectables = [];
		for (let i = 0; i < Game.COLLECTABLE_COUNT; i++) {
			let collectable = Collectable.spawn(
				[...this.collectables, this.player],
				this.canvas,
                (points) => {
                    this.score += points;
                },
			);
			this.collectables.push(collectable);
		}
		this.obstacles = [Obstacle.spawn(this.canvas.width, Game.GRAVITY)];
    }

    restart() {
        this.gameOver = false;
		this.score = 0;
        this.start();
    }

	render() {
        this.debug.innerText = this.state;
		this.background.render(this.renderContext);
		this.collectables.forEach((x) => x.render(this.renderContext));
		this.obstacles.forEach((x) => x.render(this.renderContext));
		this.player.render(this.renderContext);
		this.scoreDisplay.innerText = this.score;
        this.highScoreDisplay.innerText = this.highScore;
	}
}

var game = new Game();
game.start();
