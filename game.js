import { Background } from "./background.js";
import { Collectable } from "./collectable.js";
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
        this.highScore = 0;
        this.gameOver = false;
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

    /*
        TODO: game states:
        - PLAYING,
        - LEVEL_COMPLETE
        - DEATH

    */

	update() {
        if (this.player.animatingLevelComplete) {
            this.player.update();
            return;
        }
        if (this.gameOver) {
            return;
        }

        // Update
		this.obstacles.forEach((x) => x.update());
		this.player.update();
        this.collectables.forEach((x) => x.update(this.player));

		// Check level end condition
		if (this.player.y <= 0) { // Player made it to the top!!
            this.collectables = [];
            this.player.handelLevelComplete(() => {
                this.resetCollectablesAndObstacles();
            });
            return;
		}

        // Check obstacle collisions
        for (let obstacle of this.obstacles) {
            if (rectanglesOverlap(this.player, obstacle)) {
                this.player.jumping = false;
                this.highScore = this.score > this.highScore ? this.score : this.highScore;
                this.gameOver = true;
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
