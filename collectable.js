import { AnimatedSprite } from "./animatedSprite.js";
import { randomXYIn, findOverlapping, rectanglesOverlap } from "./utils.js";

export class Collectable {
	static SPAWN_BOTTOM_BUFFER = 100;

	constructor(game, x, y, sprite, points, width, height) {
		this.game = game;
		this.game.audioManager.load("collected", "collected.mp3");
		this.collected = false;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.sprite = sprite;
		this.points = points;
	}

	static spawn(game, entitiesToAvoid, probabilities) {
		let xy = null;
		let overlapping = null;
		let maxLoops = 100;
		let loops = 0;
		do {
			xy = randomXYIn(
				50,
				50,
				game.canvas.width,
				game.canvas.height - Collectable.SPAWN_BOTTOM_BUFFER
			);
			overlapping = findOverlapping(
				{
					x: xy.x,
					y: xy.y,
					width: 50,
					height: 50,
				},
				entitiesToAvoid
			);
			loops++;
		} while (overlapping.length > 0 && loops < maxLoops);

		// TODO: apply probabilities
		return new Collectable(
			game,
			xy.x,
			xy.y,
			new AnimatedSprite("red-gem-48-48.png", 48, 48, 0, 22, 12),
			50,
			48,
			48
		);
	}

	update() {
		if (!this.collected && rectanglesOverlap(this.game.player, this)) {
			this.collected = true;
			this.game.incrementScore(this.points);
			this.game.audioManager.play("collected");
		}
	}

	render(renderContext) {
		if (this.collected) {
			return;
		}
		this.sprite.render(renderContext, this.x, this.y);
	}
}
