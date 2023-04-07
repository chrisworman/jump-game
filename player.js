import { AnimatedSprite } from "./animatedSprite.js";
import { Velocity } from "./components.js";
import { GameState } from "./gameState.js";
import { Game } from "./game.js";
import { Platforms } from "./platforms.js";

export class Player {
	static PLATFORM_SPACING = 100;

	constructor(
		canvasWidth,
		canvasHeight,
		gravity,
		jumpSpeed,
		runningSpeed,
		userControls
	) {
		this.animatingLevelComplete = false;
		this.doneAnimatingLevelComplete = null;
		this.width = 64;
		this.height = 48;
		this.standingLeftSprite = new AnimatedSprite(
			"blob-facing-left.png",
			this.width,
			this.height,
			0,
			2,
			1
		);

		this.jumpingLeftSprite = new AnimatedSprite(
			"blob-facing-left.png",
			this.width,
			this.height,
			0,
			6,
			14
		);

		this.standingRightSprite = new AnimatedSprite(
			"blob-facing-right.png",
			this.width,
			this.height,
			0,
			2,
			1
		);

		this.jumpingRightSprite = new AnimatedSprite(
			"blob-facing-right.png",
			this.width,
			this.height,
			0,
			6,
			14
		);

		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.userControls = userControls;
		this.x = Math.floor(this.canvasWidth / 2.0 - this.width / 2.0);
		this.resetPosition();
		this.gravity = gravity;
		this.velocity = new Velocity();
		this.jumpSpeed = jumpSpeed;
		this.runningSpeed = runningSpeed;
		this.jumping = false;
		this.facingRight = false;
	}

	resetPosition() {
		this.y = Math.floor(this.canvasHeight - this.height);
	}

	update(gameState) {
		switch (gameState) {
			case GameState.PLAYING:
				this.updatePlaying();
				break;
			case GameState.LEVEL_TRANSITION:
				this.updateLevelTransition();
				break;
		}
	}

	updatePlaying() {
		// Apply the direction of the player
		if (this.userControls.left) {
			this.facingRight = false;
		} else if (this.userControls.right) {
			this.facingRight = true;
		}

		// Move player left or right
		if (this.userControls.left) {
			this.velocity.x = -this.runningSpeed;
		} else if (this.userControls.right) {
			this.velocity.x = this.runningSpeed;
		} else if (!this.jumping) { // Drift while jumping, but stop instantly on ground
			this.velocity.x = 0;
		}

		// Make player jump when space is pressed
		if (!this.jumping && this.userControls.jump) {
			this.velocity.y = this.jumpSpeed;
			this.jumpingRightSprite.reset();
			this.jumpingLeftSprite.reset();
			this.jumping = true;
		}

		// Platform detection
		if (this.jumping && this.velocity.y > 0.1) {
			// Just started falling after a jump apex
			let roundedBottomY = Math.ceil(this.y + this.height);
			if (roundedBottomY % Platforms.HEIGHT == 0) {
				this.velocity.y = 0;
				this.velocity.x = 0;
				this.y = roundedBottomY - this.height;
				this.jumping = false;
			}
		}

		// Apply gravity and jump velocity
		if (this.jumping) {
			this.velocity.y += this.gravity;
		}
		this.y += this.velocity.y;
		this.x += this.velocity.x;

		// Apply collision detection main canvas
		if (this.y + this.height > this.canvasHeight) {
			this.y = this.canvasHeight - this.height;
			this.velocity.y = 0;
			this.jumping = false;
		}
		if (this.x + this.width > this.canvasWidth) {
			this.x = this.canvasWidth - this.width;
			this.velocity.x = 0;
		}
		if (this.x <= 0) {
			this.x = 0;
			this.velocity.x = 0;
		}
	}

	updateLevelTransition() {
		this.y += this.velocity.y;
	}

	render(renderContext) {
		if (this.jumping) {
			if (this.facingRight) {
				this.jumpingRightSprite.render(renderContext, this.x, this.y);
			} else {
				this.jumpingLeftSprite.render(renderContext, this.x, this.y);
			}
		} else {
			if (this.facingRight) {
				this.standingRightSprite.render(renderContext, this.x, this.y);
			} else {
				this.standingLeftSprite.render(renderContext, this.x, this.y);
			}
		}
	}

	handelLevelComplete() {
		this.jumping = false;
		this.velocity.y = Game.LEVEL_SCROLL_SPEED;
		this.y = -this.height;
	}

	handleLevelTransitionDone() {
		this.y = this.canvasHeight - this.height;
		this.velocity.y = 0;
		this.velocity.x = 0;
	}

	handleGameOver() {
		this.jumping = false;
	}
}
