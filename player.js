import { AnimatedSprite } from "./animatedSprite.js";
import { Velocity } from "./components.js";
import { GameState } from "./gameState.js";
import { Game } from "./game.js";
import { Platforms } from "./platforms.js";
import { Bullet } from "./bullet.js";

export class Player {
	static VERTICAL_SPEED = -8;
	static HORIZONTAL_SPEED = 4.5;
	static SHOOT_DELAY_MS = 250;

	constructor(
		canvasWidth,
		canvasHeight,
		gravity,
		userControls,
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
			14,
			false
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
			14,
			false
		);

		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.userControls = userControls;
		this.x = Math.floor(this.canvasWidth / 2.0 - this.width / 2.0);
		this.resetPosition();
		this.gravity = gravity;
		this.velocity = new Velocity();
		this.jumping = false;
		this.facingRight = false;
		this.lastShootTime = null;
	}

	resetPosition() {
		this.y = Math.floor(this.canvasHeight - this.height);
	}

	getHitBox() {
		return {
			x: this.x + 10,
			y: this.y + 10,
			width: this.width - 15,
			height: this.height - 15,
		};
	}

	update(gameState, onShoot) {
		switch (gameState) {
			case GameState.PLAYING:
				this.updatePlaying(onShoot);
				break;
			case GameState.LEVEL_TRANSITION:
				this.updateLevelTransition();
				break;
		}
	}

	updatePlaying(onShoot) {
		// Apply the direction of the player
		if (this.userControls.left) {
			this.facingRight = false;
		} else if (this.userControls.right) {
			this.facingRight = true;
		}

		// Shooting?
		if (this.userControls.shoot) {
			const now = Date.now();
			if (!this.lastShootTime || now - this.lastShootTime >= Player.SHOOT_DELAY_MS) { // Time to shoot
				onShoot(Bullet.spawn(this));
				this.lastShootTime = now;
			}
		}

		// Move player left or right
		if (this.userControls.left) {
			this.velocity.x = -Player.HORIZONTAL_SPEED;
		} else if (this.userControls.right) {
			this.velocity.x = Player.HORIZONTAL_SPEED;
		} else if (!this.jumping) { // Drift while jumping, but stop instantly on ground
			this.velocity.x = 0;
		}

		// Make player jump when space is pressed
		if (!this.jumping && this.userControls.jump) {
			this.velocity.y = Player.VERTICAL_SPEED;
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
