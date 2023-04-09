import { randomIntBetween } from "./utils.js";
import { Velocity } from "./components.js";
import { AnimatedSprite } from "./animatedSprite.js";

export class Enemy {
	static WIDTH = 48;
	static HEIGHT = 48;

	constructor(x, y, gravity, sprite) {
		this.enemyType = 'fire-ball';
		this.x = x;
		this.y = y;
		this.width = Enemy.WIDTH;
		this.height = Enemy.HEIGHT;
		this.sprite = sprite;
		this.gravity = gravity - 0.1; // TODO
		this.velocity = new Velocity();
	}

	static spawn(canvasWidth, gravity) {
		return new Enemy(
			randomIntBetween(0, canvasWidth - Enemy.WIDTH),
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

	update(onOffscreen) {
		this.velocity.y += this.gravity;
		this.y += this.velocity.y;
		this.x += this.velocity.x;
		if (this.y > 800) {
			onOffscreen(this);
		}
	}
}
