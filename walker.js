import { AnimatedSprite } from "./animatedSprite.js";
import { EnemyTypes } from "./enemyTypes.js";
import { Platforms } from "./platforms.js";
import { randomFromArray, randomIntBetween, randomSign } from "./utils.js";

export class Walker {
	static WIDTH = 24;
	static HEIGHT = 63;
	static SPEED = 2;

	constructor(x, y, speed, walkingSprite, dyingSprite) {
		this.isShootable = true;
		this.enemyType = EnemyTypes.WALKER;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.walkingSprite = walkingSprite;
		this.dyingSprite = dyingSprite;
		this.width = Walker.WIDTH;
		this.height = Walker.HEIGHT;
		this.isShot = false;
	}

	static spawn(canvasWidth) {
		return new Walker(
			randomIntBetween(1, canvasWidth - Walker.WIDTH - 1),
			randomFromArray(Platforms.getPlatformYs()) - Walker.HEIGHT,
			randomSign() * Walker.SPEED,
			new AnimatedSprite("cubes.png", 24, 63, 0, 2, 3),
			new AnimatedSprite("cubes.png", 24, 63, 0, 10, 9, false)
		);
	}

	isDead() {
		return this.dyingSprite.reachedEnd;
	}

	render(renderContext) {
		if (this.isShot) {
			this.dyingSprite.render(renderContext, this.x, this.y);
		} else {
			this.walkingSprite.render(renderContext, this.x, this.y);
		}
	}

	update() {
		if (this.isShot) {
			return;
		}
		this.x += this.speed;
		if (this.x + this.width >= 550) {
			// Change direction
			this.x = this.x - 1;
			this.speed = -Walker.SPEED;
		} else if (this.x <= 0) {
			this.x = 1;
			this.speed = Walker.SPEED;
		}
	}
}
