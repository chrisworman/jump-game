import { SpriteLibrary } from "./spriteLibrary.js";
import { rectanglesOverlap } from "./utils.js";

export class Bullet {
	static SPEED = 8;

	constructor(game, x, y, sprite, speed) {
		this.game = game;
		this.isOffScreen = false;
		this.hitEnemy = false;
		this.x = x;
		this.y = y;
		this.width = SpriteLibrary.SIZES.BULLET.width;
		this.height = SpriteLibrary.SIZES.BULLET.height;
		this.sprite = sprite;
		this.speed = speed;
	}

	static spawn(game) {
		return new Bullet(
			game,
			game.player.x +
				(game.player.facingRight ? game.player.width - 15 : 15),
			game.player.y +
				game.player.width / 2 -
				SpriteLibrary.SIZES.BULLET.width / 2,
			SpriteLibrary.bullet(),
			game.player.facingRight ? Bullet.SPEED : -Bullet.SPEED
		);
	}

	render(renderContext) {
		if (this.hitEnemy) {
			return;
		}
		this.sprite.render(renderContext, this.x, this.y);
	}

	update() {
		if (this.hitEnemy) {
			return;
		}

		this.x += this.speed;
		this.isOffScreen = this.x > this.game.width || this.x + this.width < 0;

		// Check for shot enemies
		for (let enemy of this.game.enemies) {
			if (
				enemy.isShootable &&
				!enemy.isShot &&
				!enemy.isDead &&
				rectanglesOverlap(enemy, this)
			) {
				enemy.isShot = true;
				this.hitEnemy = true;
			}
		}
	}
}
