import { Collectable } from "./collectable.js";
import { Game } from "./game.js";
import { Enemy } from "./enemy.js";
import { randomIntBetween } from "./utils.js";
import { Walker } from "./walker.js";

export class Level {
    static ENEMY_SPAWN_DELAY_MS = 2000;
    static NO_ENEMY_BUFFER = 300;

	constructor(number, canvas, player, collectableCount, collectableProbabilities, platformSprite) {
        this.number = number;
		this.canvas = canvas;
		this.player = player;
		this.collectableCount = collectableCount;
		this.collectableProbabilities = collectableProbabilities;
        this.platformSprite = platformSprite;
        this.enemySpawnTime = null;
	}

	spawnEnemies(currentEnemies) {
		// Based upon some rules (eg. rolling dice, player's position), spawn 0 or more enemies
		if (
			currentEnemies.filter(x => x.enemyType == 'fire-ball').length === 0 &&
			this.player.y < this.canvas.height - Level.NO_ENEMY_BUFFER &&
            this.player.y > Level.NO_ENEMY_BUFFER
		) {
            const now = Date.now();
            if (!this.enemySpawnTime || now - this.enemySpawnTime >= (Level.ENEMY_SPAWN_DELAY_MS - this.number)) {
                this.enemySpawnTime = now;
			    currentEnemies.push(Enemy.spawn(this.canvas.width, Game.GRAVITY));
            }
		}
	}

	spawnInitialEnemies() {
        let initialEnemies = [];
        for (let i=1; i<Math.floor(this.number / 2); i++) {
            initialEnemies.push(Walker.spawn(this.canvas.width));
        }
        return initialEnemies;
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
