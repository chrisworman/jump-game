import { randomIntBetween } from "./utils.js";
import { Velocity } from "./components.js";
import { AnimatedSprite } from "./animatedSprite.js";
import { EnemyTypes } from "./enemyTypes.js";

export class FireBall {
	static WIDTH = 48;
	static HEIGHT = 48;

	constructor(x, y, gravity, sprite) {
		this.isShootable = false;
		this.isOffScreen = false;
		this.enemyType = EnemyTypes.FIRE_BALL;
		this.x = x;
		this.y = y;
		this.width = FireBall.WIDTH;
		this.height = FireBall.HEIGHT;
		this.sprite = sprite;
		this.gravity = gravity - 0.1; // TODO
		this.velocity = new Velocity();
	}

	static spawn(canvasWidth, gravity) {
		return new FireBall(
			randomIntBetween(0, canvasWidth - FireBall.WIDTH),
			0,
			gravity,
			new AnimatedSprite("fire-ball.png", 48, 48, 0, 5, 8)
		);
	}

	isDead() {
		return false;
	}

	render(renderContext) {
		this.sprite.render(renderContext, this.x, this.y);
	}

	update() {
		this.velocity.y += this.gravity;
		this.y += this.velocity.y;
		this.x += this.velocity.x;
		this.isOffScreen = this.y > 800; // TODO: reference this.game.height
	}
}
