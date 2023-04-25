import { Bomb } from "./bomb.js";
import { EnemyTypes } from "./enemyTypes.js";
import { SpriteLibrary } from "./spriteLibrary.js";
import { randomSign } from "./utils.js";
import { Emitter } from "./emitter.js";

export class FireFlower {
	constructor(game, x, y) {
		this.enemyType = EnemyTypes.FIRE_FLOWER;
		this.game = game;
		this.isDead = false;
		this.isShot = false;
		this.isShootable = true;
		this.isOffScreen = false;

		this.x = x;
		this.y = y;
		this.sprite = SpriteLibrary.fireBall(); // TODO: proper sprite
		this.width = this.sprite.width;
		this.height = this.sprite.height;
		this.spawn = {
			x: x + this.sprite.width * 0.5,
			y: y,
		};
		this.bombEmitter = new Emitter({
			emit: () => {
				game.enemies.push(
					Bomb.spawnFrom(
						this.spawn.x,
						this.spawn.y,
						randomSign(),
						SpriteLibrary.bullet() // TODO: proper sprite
					)
				);
			},
			// randomDelays: { min: 500, max: 3000 },
			delays: [200, 200, 200, 500, 200, 200, 200, 2000],
		});
	}

	render(renderContext) {
		if (this.isDead) {
			return;
		}
		this.sprite.render(renderContext, this.x, this.y);
	}

	update() {
		if (this.isDead) {
			return;
		}
		this.bombEmitter.update();
	}

	handleShot() {
		this.isShot = true;
		this.isDead = true;
	}
}
