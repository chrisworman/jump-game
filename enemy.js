import { randomIntBetween } from "./utils.js";
import { Velocity } from "./components.js";
import { Sprite } from "./sprite.js";

export class Enemy {
	static WIDTH = 45;
	static HEIGHT = 50;

	constructor(x, y, width, height, gravity, sprite) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.sprite = sprite;
		this.gravity = gravity;
		this.velocity = new Velocity();
	}

	static spawn(canvasWidth, gravity) {
		return new Enemy(
			randomIntBetween(0, canvasWidth - Enemy.WIDTH),
			0,
			Enemy.WIDTH,
			Enemy.HEIGHT,
			gravity,
			new Sprite('rock.png'),
		);
	}

	render(renderContext) {
		this.sprite.render(renderContext, this.x, this.y);
	}

	update() {
		this.velocity.y += this.gravity;
		this.y += this.velocity.y;
		this.x += this.velocity.x;
	}
}
