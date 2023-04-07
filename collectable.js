import { Sprite } from "./sprite.js";
import { AnimatedSprite } from "./animatedSprite.js";
import { randomXYIn, findOverlapping, rectanglesOverlap } from "./utils.js";

export class Collectable {
	static SPAWN_BOTTOM_BUFFER = 100;

	constructor(x, y, sprite, points, width, height) {
		this.collected = false;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.sprite = sprite;
		this.sprite.opacity = 0.75;
		this.points = points;
	}

	static spawn(entitiesToAvoid, canvas, probabilities) {
		let xy = null;
		let overlapping = null;
		let maxLoops = 100;
		let loops = 0;
		do {
			xy = randomXYIn(
				50,
				50,
				canvas.width,
				canvas.height - Collectable.SPAWN_BOTTOM_BUFFER
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
			xy.x,
			xy.y,
			new AnimatedSprite("red-gem-48-48.png", 48, 48, 0, 22, 12),
			50,
			48,
			48
		);
	}

	update(player, onCollected) {
		if (!this.collected && rectanglesOverlap(player, this)) {
			this.collected = true;
			onCollected(this.points);
		}
	}

	render(renderContext) {
		if (this.collected) {
			return;
		}
		this.sprite.render(renderContext, this.x, this.y);
	}
}
