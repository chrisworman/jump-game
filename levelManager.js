import { Level } from "./level.js";
import { Sprite } from "./sprite.js";

export class LevelManager {
	constructor(canvas, player) {
		this.canvas = canvas;
		this.player = player;
		this.collectableCount = 0;
	}

	getNextLevel() {
		if (this.collectableCount < 25) {
			this.collectableCount += 5;
		}
		return new Level(
			this.canvas,
			this.player,
			this.collectableCount,
			"TODO: probabilities",
			new Sprite('ground.png'),
		);
	}

	hasNextLevel() {
		return true;
	}

	reset() {
		this.collectableCount = 0;
	}
}
