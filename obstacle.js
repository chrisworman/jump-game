import { AnimatedSprite } from "./animatedSprite.js";
import { randomIntBetween } from "./utils.js";
import { Velocity } from "./components.js";
import { Sprite } from "./sprite.js";

export class Obstacle {
	static OBSTACLE_WIDTH = 45;
	static OBSTACLE_HEIGHT = 50;

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
		return new Obstacle(
			randomIntBetween(0, canvasWidth - Obstacle.OBSTACLE_WIDTH),
			0,
			Obstacle.OBSTACLE_WIDTH,
			Obstacle.OBSTACLE_HEIGHT,
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
