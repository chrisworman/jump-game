import { Level } from "./level.js";
import { Sprite } from "./sprite.js";

export class LevelManager {
	constructor(canvas, player) {
		this.canvas = canvas;
		this.player = player;
		this.levelNumber = 0;
		this.collectableCount = 0;
	}

	getNextLevel() {
		if (this.collectableCount < 50) {
			this.collectableCount += 2;
		}
		this.levelNumber++;
		return new Level(
			this.levelNumber,
			this.canvas,
			this.player,
			this.collectableCount,
			"TODO: probabilities",
			this.levelNumber % 2 === 0
				? new Sprite("ground.png")
				: new Sprite("ground-2.png")
		);
	}

	hasNextLevel() {
		return true;
	}

	reset() {
		this.collectableCount = 0;
	}
}
