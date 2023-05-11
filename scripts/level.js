import { Collectable } from './collectable.js';
import { FireBall } from './fireBall.js';
import { Walker } from './walker.js';
import { EnemyTypes } from './enemyTypes.js';
import { Turret } from './turret.js';

export class Level {
    static MAX_FIRE_BALL_SPAWN_DELAY_MS = 4000;
    static MAX_WALKERS = 8;
    static NO_ENEMY_BUFFER = 300;

    constructor(game, number, world, title, platformSprites) {
        this.game = game;
        this.number = number;
        this.world = world;
        this.title = title;
        this.platformSprites = platformSprites;
        this.enemySpawnTime = null;
    }

    spawnEnemies() {
        if (this.world.boss) {
            return;
        }

        if (
            this.number > 1 &&
            this.game.player.y < this.game.canvas.height - Level.NO_ENEMY_BUFFER &&
            this.game.player.y > Level.NO_ENEMY_BUFFER &&
            this.game.enemies.filter((x) => x.type === EnemyTypes.FIRE_BALL && !x.isOffScreen)
                .length === 0
        ) {
            const now = performance.now();
            if (
                !this.enemySpawnTime ||
                now - this.enemySpawnTime >=
                    Level.MAX_FIRE_BALL_SPAWN_DELAY_MS - 15 * this.world.number * this.number
            ) {
                this.enemySpawnTime = now;
                this.game.enemies.push(FireBall.spawn(this.game));
            }
        }
    }

    spawnInitialEnemies() {
        if (this.world.boss) {
            return [this.world.boss];
        }

        const initialEnemies = [];
        const walkerSpawnCount = Math.min(Level.MAX_WALKERS, this.world.number + this.number - 1);
        for (let i = 0; i < walkerSpawnCount; i++) {
            initialEnemies.push(Walker.spawn(this.game));
        }

        if (this.number > 1) {
            const turrentCount = Math.min(2, Math.max(1, this.world.number - 2));
            for (let t = 0; t < turrentCount; t++) {
                initialEnemies.push(Turret.spawn(this.game));
            }
        }

        return initialEnemies;
    }

    spawnCollectables() {
        if (this.world.boss) {
            return [];
        }

        const collectables = [];
        const collectableCount = Math.ceil(this.world.number + this.number * 0.5);
        for (let i = 0; i < collectableCount; i++) {
            const collectable = Collectable.spawn(
                this.game,
                [...collectables, this.game.player, ...this.game.enemies], // Prevent overlapping collectables
            );
            collectables.push(collectable);
        }
        return collectables;
    }

    isComplete() {
        // Fighting a boss?
        if (this.world.boss) {
            return this.world.boss.isDead;
        }

        // Normal level is complete when player reaches the top
        return this.game.player.y + this.game.player.height <= 0;
    }
}
