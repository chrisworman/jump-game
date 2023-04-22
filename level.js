import { Collectable } from "./collectable.js";
import { Game } from "./game.js";
import { FireBall } from "./fireBall.js";
import { Walker } from "./walker.js";
import { EnemyTypes } from "./enemyTypes.js";

export class Level {
	static ENEMY_SPAWN_DELAY_MS = 2000;
	static NO_ENEMY_BUFFER = 300;

	constructor(
		game,
		number,
		collectableCount,
		collectableProbabilities,
		platformSprite
	) {
		this.number = number;
		this.game = game;
		this.collectableCount = collectableCount;
		this.collectableProbabilities = collectableProbabilities;
		this.platformSprite = platformSprite;
		this.enemySpawnTime = null;
	}

	spawnEnemies() {
		if (
			this.number > 1 &&
			this.game.player.y <
				this.game.canvas.height - Level.NO_ENEMY_BUFFER &&
			this.game.player.y > Level.NO_ENEMY_BUFFER &&
			this.game.enemies.filter((x) => x.enemyType == EnemyTypes.FIRE_BALL)
				.length === 0
		) {
			const now = Date.now();
			if (
				!this.enemySpawnTime ||
				now - this.enemySpawnTime >=
					Level.ENEMY_SPAWN_DELAY_MS - this.number
			) {
				this.enemySpawnTime = now;
				this.game.enemies.push(
					FireBall.spawn(this.game.canvas.width, Game.GRAVITY)
				);
			}
		}
	}

	spawnInitialEnemies() {
		let initialEnemies = [];
		for (let i = 1; i < Math.floor(this.number / 2); i++) {
			initialEnemies.push(Walker.spawn(this.game.canvas.width));
		}
		return initialEnemies;
	}

	spawnCollectables() {
		// return an array of collectables for the level
		let collectables = [];
		for (let i = 0; i < this.collectableCount; i++) {
			let collectable = Collectable.spawn(
				this.game,
				[...collectables, this.game.player], // Prevent overlapping collectables
				this.collectableProbabilities
			);
			collectables.push(collectable);
		}
		return collectables;
	}
}
