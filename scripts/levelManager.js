import { Level } from "./level.js";
import { SpriteLibrary } from "./spriteLibrary.js";
import { Walker } from "./walker.js";

export class LevelManager {
	static LEVELS_PER_WORLD = 20;
	static WORLD_COUNT = 5;

	constructor(game) {
		this.game = game;
		this.levelNumber = 0;
		this.worldNumber = 1;

		// Bosses
		// TODO: invent and populate bosses!
		this.worldBossFactories = new Map([
			[1, () => Walker.spawn(this.game.canvas.width)],
			[2, () => Walker.spawn(this.game.canvas.width)],
			[3, () => Walker.spawn(this.game.canvas.width)],
			[4, () => Walker.spawn(this.game.canvas.width)],
			[5, () => Walker.spawn(this.game.canvas.width)],
		]);
	}

	getNextLevel() {

		if (this.worldNumber > LevelManager.WORLD_COUNT) {
			return null;
		}

		// Advance to the next level & world
		this.levelNumber++;
		if (this.levelNumber > LevelManager.LEVELS_PER_WORLD) {
			this.levelNumber = 1;
			this.worldNumber++;
			if (this.worldNumber > LevelManager.WORLD_COUNT) {
				return null; // Finished last level
			}
		}

		const world = {
			number: this.worldNumber,
			title: `World ${this.worldNumber}`,
			boss:
				this.levelNumber === LevelManager.LEVELS_PER_WORLD // Last level in world? ...
					? this.worldBossFactories.get(this.worldNumber)() // Boss level!
					: null,
		};

		return new Level(
			this.game,
			this.levelNumber,
			world,
			`Level ${this.levelNumber}`,
			"TODO: probabilities",
			this.getPlatformSprite()
		);
	}

	getPlatformSprite() {
		switch (this.worldNumber) {
			case 1:
				return this.levelNumber % 2 === 0
					? SpriteLibrary.groundGreen()
					: SpriteLibrary.groundPurple();
			case 2:
				return this.levelNumber % 2 === 0
					? SpriteLibrary.groundGreen()
					: SpriteLibrary.groundPurple();
			case 3:
				return this.levelNumber % 2 === 0
					? SpriteLibrary.groundGreen()
					: SpriteLibrary.groundPurple();
			case 4:
				return this.levelNumber % 2 === 0
					? SpriteLibrary.groundGreen()
					: SpriteLibrary.groundPurple();
			case 5:
				return this.levelNumber % 2 === 0
					? SpriteLibrary.groundGreen()
					: SpriteLibrary.groundPurple();
			default:
				throw new Error(
					`No platform sprite for world ${this.worldNumber}`
				);
		}
	}

	reset() {
		this.levelNumber = 0;
		this.worldNumber = 1;
	}
}
