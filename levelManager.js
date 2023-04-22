import { Level } from "./level.js";
import { Sprite } from "./sprite.js";

export class LevelManager {
	constructor(game) {
		this.game = game;
		this.levelNumber = 0;
		this.collectableCount = 0;
	}

	getNextLevel() {
		if (this.collectableCount < 100) {
			this.collectableCount += 2;
		}
		this.levelNumber++;
		return new Level(
			this.game,
			this.levelNumber,
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
