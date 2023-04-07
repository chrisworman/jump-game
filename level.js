import { Collectable } from "./collectable.js";
import { Game } from "./game.js";
import { Enemy } from "./enemy.js";

export class Level {
	constructor(canvas, player, collectableCount, collectableProbabilities, platformSprite) {
		this.canvas = canvas;
		this.player = player;
		this.collectableCount = collectableCount;
		this.collectableProbabilities = collectableProbabilities;
        this.platformSprite = platformSprite;
	}

	spawnEnemies(currentEnemies) {
		// Based upon some rules (eg. rolling dice, player's position), spawn 0 or more enemies
		if (
			currentEnemies.length < 2 &&
			this.player.y <= this.canvas.height / 2
		) {
			currentEnemies.push(Enemy.spawn(this.canvas.width, Game.GRAVITY));
		}
	}

	spawnInitialEnemies() {
		return [Enemy.spawn(this.canvas.width, Game.GRAVITY)];
	}

	spawnCollectables() {
		// return an array of collectables for the level
		// need things like canvas, player
		let collectables = [];
		for (let i = 0; i < this.collectableCount; i++) {
			let collectable = Collectable.spawn(
				[...collectables, this.player], // Prevent overlapping collectables
				this.canvas,
				this.collectableProbabilities
			);
			collectables.push(collectable);
		}
        return collectables;
	}
}
