import { Velocity } from "./components.js";
import { EnemyTypes } from "./enemyTypes.js";
import { Game } from "./game.js";

export class Bomb {
	static SPAWN_SPEED_X = 3;
    static SPAWN_SPEED_Y = 8;

	constructor(x, y, velocity, sprite) {
		this.enemyType = EnemyTypes.BOMB;
		this.isDead = false;
		this.isShot = false;
		this.isShootable = false;
		this.isOffScreen = false;

		this.sprite = sprite;
		this.x = x;
		this.y = y;
		this.width = sprite.width;
		this.height = sprite.height;
		this.velocity = velocity;
	}

	render(renderContext) {
		if (this.isOffScreen) {
			return;
		}
		this.sprite.render(renderContext, this.x, this.y);
	}

	update() {
		if (this.isOffScreen) {
			return;
		}
		this.velocity.y += Game.GRAVITY;
		this.y += this.velocity.y;
		this.x += this.velocity.x;
		this.isOffScreen = this.y > 800; // TODO: reference this.game.height
	}

	handleShot() {
		/* bombs are invincible */
	}

	/*
        verticalDirection = 1 => left to right
        verticalDirection = -1 => right to left
    */
	static spawnFrom(x, y, verticalDirection, sprite) {
		const velocity = new Velocity(
			verticalDirection * Bomb.SPAWN_SPEED_X,
			-Bomb.SPAWN_SPEED_Y
		);
		return new Bomb(x, y, velocity, sprite);
	}
}
