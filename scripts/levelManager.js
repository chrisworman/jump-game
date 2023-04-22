import { Level } from "./level.js";
import { SpriteLibrary } from "./spriteLibrary.js";

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
				? SpriteLibrary.groundGreen()
				: SpriteLibrary.groundPurple()
		);
	}

	hasNextLevel() {
		return true;
	}
}
