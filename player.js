import { AnimatedSprite } from "./animatedSprite.js";
import { Velocity } from "./components.js";
import { Sprite } from "./sprite.js";
import { rectanglesOverlap } from "./utils.js";

export class Player {
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
		// this.sprite = new Sprite('yellow-climber.png');
		this.standingLeftSprite = new AnimatedSprite(
			"blob-facing-left.png",
			[0, this.width],
			[0, 0],
			this.width,
			this.height,
			1
		);

		this.jumpingLeftSprite = new AnimatedSprite(
			"blob-facing-left.png",
			[
				0,
				this.width,
				this.width * 2,
				this.width * 3,
				this.width * 4,
				this.width * 5,
			],
			[0, 0, 0, 0, 0, 0],
			this.width,
			this.height,
			12
		);

		this.standingRightSprite = new AnimatedSprite(
			"blob-facing-right.png",
			[0, this.width],
			[0, 0],
			this.width,
			this.height,
			1
		);

		this.jumpingRightSprite = new AnimatedSprite(
			"blob-facing-right.png",
			[
				0,
				this.width,
				this.width * 2,
				this.width * 3,
				this.width * 4,
				this.width * 5,
			],
			[0, 0, 0, 0, 0, 0],
			this.width,
			this.height,
			12
		);

		// this.sprite = this.standingSprite;

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
		// this.x = Math.floor((this.canvasWidth / 2.0) - (this.width / 2.0));
		this.y = Math.floor(this.canvasHeight - this.height);
	}

	update() {
		if (this.animatingLevelComplete) {
			this.jumping = false;
			this.velocity.y = 10;
			this.y += this.velocity.y;
			if (this.y + this.height >= this.canvasHeight) {
				this.y = this.canvasHeight - this.height;
				this.velocity.y = 0;
				this.velocity.x = 0;
				this.animatingLevelComplete = false;
				this.doneAnimatingLevelComplete();
			}
		} else {
			if (this.userControls.left) {
				this.facingRight = false;
			} else if (this.userControls.right) {
				this.facingRight = true;
			}

			// Move player left or right
			if (this.jumping) {
				if (this.userControls.left) {
					this.velocity.x = -this.runningSpeed;
				} else if (this.userControls.right) {
					this.velocity.x = this.runningSpeed;
				}
			} else {
				this.velocity.x = 0;
			}

			// Make player jump when space is pressed
			if (!this.jumping && this.userControls.jump) {
				this.velocity.y = this.jumpSpeed;
				this.jumpingRightSprite.reset();
                this.jumpingLeftSprite.reset();
				this.jumping = true;
			}

			// Stop jumping, cling to wall slightly after reaching apex
			if (this.jumping && this.velocity.y > 1.0) {
				this.velocity.y = 0;
				this.jumping = false;
			}

			// Apply gravity and jump velocity
			if (this.jumping) {
				this.velocity.y += this.gravity;
			}
			this.y += this.velocity.y;
			this.x += this.velocity.x;
		}

		// Collision detect main canvas
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

	handelLevelComplete(doneAnimatingLevelComplete) {
		this.animatingLevelComplete = true;
		this.doneAnimatingLevelComplete = doneAnimatingLevelComplete;
	}
}
