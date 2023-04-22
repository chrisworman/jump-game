import { Velocity } from "./components.js";
import { GameState } from "./gameState.js";
import { Game } from "./game.js";
import { Platforms } from "./platforms.js";
import { Bullet } from "./bullet.js";
import { rectanglesOverlap } from "./utils.js";
import { AudioManager } from "./audioManager.js";
import { SpriteLibrary } from "./spriteLibrary.js";

export class Player {
	static VERTICAL_SPEED = -8;
	static HORIZONTAL_SPEED = 4.5;
	static SHOOT_DELAY_MS = 250;
	static INITIAL_HEALTH = 3;

	constructor(game) {
		this.game = game;
		this.setHealth(Player.INITIAL_HEALTH);

		this.standingLeftSprite = SpriteLibrary.playerStandingLeft();
		this.standingRightSprite = SpriteLibrary.playerStandingRight();
		this.jumpingLeftSprite = SpriteLibrary.playerJumpingLeft();
		this.jumpingRightSprite = SpriteLibrary.playerJumpingRight();

		this.width = SpriteLibrary.SIZES.PLAYER.width;
		this.height = SpriteLibrary.SIZES.PLAYER.height;
		
		this.velocity = new Velocity();
		this.x = Math.floor(this.game.canvas.width / 2.0 - this.width / 2.0);
		this.y = Math.floor(this.game.canvas.height - this.height);

		this.jumping = false;
		this.facingRight = false;
		this.lastShootTime = null;
		this.recovering = false;
		this.recoveringStartTime = null;
	}

	getHitBox() {
		return {
			x: this.x + 10,
			y: this.y + 10,
			width: this.width - 15,
			height: this.height - 15,
		};
	}

	update() {
		switch (this.game.state) {
			case GameState.PLAYING:
				this.updatePlaying();
				break;
			case GameState.LEVEL_TRANSITION:
				this.updateLevelTransition();
				break;
		}
	}

	updatePlaying() {
		// Check enemy collisions
		if (!this.recovering) {
			const playerHitBox = this.getHitBox();
			for (let enemy of this.game.enemies) {
				if (!enemy.isShot && rectanglesOverlap(playerHitBox, enemy)) {
					// We hit an enemy!!
					if (this.health > 1) {
						this.setHealth(this.health - 1);
						break; // Still alive, but recovering, so no need to keep checking enemies
					} else {
						this.setHealth(0); // XXX DEAD! XXX
						return; // No need to update anything else if we are dead
					}
				}
			}
		}

		// Done recovering?
		if (this.recovering && Date.now() - this.recoveringStartTime > 4000) {
			this.recovering = false;
			this.recoveringStartTime = null;
		}

		// Apply the direction of the player
		if (this.game.userControls.left) {
			this.facingRight = false;
		} else if (this.game.userControls.right) {
			this.facingRight = true;
		}

		// Shooting?
		if (this.game.userControls.shoot) {
			const now = Date.now();
			if (
				!this.lastShootTime ||
				now - this.lastShootTime >= Player.SHOOT_DELAY_MS
			) {
				// Time to shoot
				this.game.audioManager.play(
					AudioManager.AUDIO_FILES.PLAYER_SHOOT
				);
				this.game.bullets.push(Bullet.spawn(this.game));
				this.lastShootTime = now;
			}
		}

		// Move player left or right
		if (this.game.userControls.left) {
			this.velocity.x = -Player.HORIZONTAL_SPEED;
		} else if (this.game.userControls.right) {
			this.velocity.x = Player.HORIZONTAL_SPEED;
		} else if (!this.jumping) {
			// Drift while jumping, but stop instantly on ground
			this.velocity.x = 0;
		}

		// Make player jump when space is pressed
		if (!this.jumping && this.game.userControls.jump) {
			this.game.audioManager.play(AudioManager.AUDIO_FILES.PLAYER_JUMP);
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
			this.velocity.y += Game.GRAVITY;
		}
		this.y += this.velocity.y;
		this.x += this.velocity.x;

		// Apply collision detection main canvas
		if (this.y + this.height > this.game.canvas.height) {
			this.y = this.game.canvas.height - this.height;
			this.velocity.y = 0;
			this.jumping = false;
		}
		if (this.x + this.width > this.game.canvas.width) {
			this.x = this.game.canvas.width - this.width;
			this.velocity.x = 0;
		}
		if (this.x <= 0) {
			this.x = 0;
			this.velocity.x = 0;
		}
	}

	updateLevelTransition() {
		this.y += this.velocity.y; // TODO: this should just be something like this.game.LEVEL_TRANSITION_SCROLL_SPEED
	}

	render(renderContext) {
		// Semi transparent when recovering
		// TODO: pulsate the opacity
		if (this.recovering) {
			this.jumpingLeftSprite.filterManager.opacityPercent = 50;
			this.jumpingRightSprite.filterManager.opacityPercent = 50;
			this.standingLeftSprite.filterManager.opacityPercent = 50;
			this.standingRightSprite.filterManager.opacityPercent = 50;
		} else {
			this.jumpingLeftSprite.filterManager.opacityPercent = 100;
			this.jumpingRightSprite.filterManager.opacityPercent = 100;
			this.standingLeftSprite.filterManager.opacityPercent = 100;
			this.standingRightSprite.filterManager.opacityPercent = 100;
		}

		// Render the current sprite
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
		this.y = this.game.canvas.height - this.height;
		this.velocity.y = 0;
		this.velocity.x = 0;
	}

	setHealth(health) {
		// Reduction in health, but still alive?
		if (health > 0 && this.health > health) {
			this.recovering = true;
			this.recoveringStartTime = Date.now();
			// TODO: start pulsating opacity or brightness
		}

		if (health === 0) {
			// Dead
			this.jumping = false;
		}

		this.health = health;

		// Update display
		const heartsHtmlBuffer = [];
		for (let i = 0; i < this.health; i++) {
			heartsHtmlBuffer.push('<div class="heart"></div>');
		}
		for (let i = 0; i < 3 - this.health; i++) {
			heartsHtmlBuffer.push('<div class="heart-empty"></div>');
		}
		this.game.heartsDisplay.innerHTML = heartsHtmlBuffer.join("");
	}
}
