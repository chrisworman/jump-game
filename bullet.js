import { Sprite } from "./sprite.js";
import { rectanglesOverlap } from "./utils.js";

export class Bullet {
	static WIDTH = 24;
	static HEIGHT = 12;
	static SPEED = 8;

	constructor(game, x, y, sprite, speed) {
		this.game = game;
		this.isOffScreen = false;
		this.hitEnemy = false;
		this.x = x;
		this.y = y;
		this.width = Bullet.WIDTH;
		this.height = Bullet.HEIGHT;
		this.sprite = sprite;
		this.speed = speed;
	}

	static spawn(game) {
		return new Bullet(
			game,
			game.player.x +
				(game.player.facingRight ? game.player.width - 15 : 15),
			game.player.y + game.player.width / 2 - Bullet.WIDTH / 2,
			new Sprite("bullet.png"),
			game.player.facingRight ? Bullet.SPEED : -Bullet.SPEED
		);
	}

	render(renderContext) {
		this.sprite.render(renderContext, this.x, this.y);
	}

	update() {
		this.x += this.speed;
		this.isOffScreen = this.x > 550 || this.x + this.width < 0;

		// Check for shot enemies
		for (let enemy of this.game.enemies) {
			if (enemy.isShootable && rectanglesOverlap(enemy, this)) {
				enemy.isShot = true;
				this.hitEnemy = true;
			}
		}
	}
}
