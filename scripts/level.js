import { Collectable } from './collectable.js';
import { Game } from './game.js';
import { FireBall } from './fireBall.js';
import { Walker } from './walker.js';
import { EnemyTypes } from './enemyTypes.js';
import { FireFlower } from './fireFlower.js';

export class Level {
    static MAX_FIRE_BALL_SPAWN_DELAY_MS = 4000;
    static NO_ENEMY_BUFFER = 300;

    constructor(game, number, world, title, collectableProbabilities, platformSprite) {
        this.game = game;
        this.number = number;
        this.world = world;
        this.title = title;
        this.collectableProbabilities = collectableProbabilities;
        this.platformSprite = platformSprite;
        this.enemySpawnTime = null;
    }

    spawnEnemies() {
        if (this.world.boss) {
            return; // TODO: For now we won't spawn other enemies during boss levels, but this can change
        }

        if (
            this.number > 1 &&
            this.game.player.y < this.game.canvas.height - Level.NO_ENEMY_BUFFER &&
            this.game.player.y > Level.NO_ENEMY_BUFFER &&
            this.game.enemies.filter((x) => x.enemyType === EnemyTypes.FIRE_BALL && !x.isOffScreen)
                .length === 0
        ) {
            const now = Date.now();
            if (
                !this.enemySpawnTime ||
                now - this.enemySpawnTime >=
                    Level.MAX_FIRE_BALL_SPAWN_DELAY_MS - 15 * this.world.number * this.number
            ) {
                this.enemySpawnTime = now;
                this.game.enemies.push(FireBall.spawn(this.game.canvas.width));
            }
        }
    }

    spawnInitialEnemies() {
        if (this.world.boss) {
            return [this.world.boss]; // TODO: For now we won't spawn other enemies during boss levels, but this can change
        }
        const initialEnemies = [];

        const walkerSpawnCount = this.world.number + this.number - 1;
        for (let i = 1; i < walkerSpawnCount; i++) {
            initialEnemies.push(Walker.spawn(this.game.canvas.width));
        }

        initialEnemies.push(new FireFlower(this.game, 200, 355));

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
                this.collectableProbabilities
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
