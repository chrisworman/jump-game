import { Collectable } from './collectable.js';
import { FireBall } from './fireBall.js';
import { Walker } from './walker.js';
import { Turret } from './turret.js';
import { Spawner } from './spawner.js';
import { Tank } from './tank.js';
import { Tower } from './tower.js';
import { LevelManager } from './levelManager.js';

export class Level {
    static MAX_FIRE_BALL_SPAWN_DELAY_MS = 5000;
    static MAX_WALKERS = 8;
    static NO_ENEMY_BUFFER = 300;

    constructor(game, number, world, title, platformSprites) {
        this.game = game;
        this.number = number;
        this.world = world;
        this.title = title;
        this.platformSprites = platformSprites;

        this.boss = number === LevelManager.LEVELS_PER_WORLD ? this.world.getBoss() : null;
        this.enemySpawnTime = null;
        this.collectableSpawner = new Spawner(() => {
            return Collectable.spawn(game);
        });
        this.walkerSpawner = new Spawner(() => {
            return Walker.spawn(game);
        });
        this.turrentSpawner = new Spawner(() => {
            return Turret.spawn(game);
        });
        this.tankSpawner = new Spawner(() => {
            return Tank.spawn(game);
        });
        this.towerSpawner = new Spawner(() => {
            return Tower.spawn(game);
        });
    }

    spawnEnemies() {
        if (this.boss) {
            return;
        }

        if (
            this.number > 1 &&
            this.game.player.y < this.game.canvas.height - Level.NO_ENEMY_BUFFER &&
            this.game.player.y > Level.NO_ENEMY_BUFFER
        ) {
            const now = this.game.gameTime;
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
        if (this.boss) {
            return [this.boss];
        }

        const initialEnemies = [];

        // Walkers
        const walkerSpawnCount = Math.min(
            Level.MAX_WALKERS,
            Math.max(1, this.world.number * 2 + this.number - 10)
        );
        for (let i = 0; i < walkerSpawnCount; i++) {
            initialEnemies.push(this.walkerSpawner.spawnWithoutIntersecting(initialEnemies));
        }

        // Tanks
        if (this.number > 5) {
            const maxTanks = this.world.number <= 3 ? 1 : 2;
            const tankCount = Math.min(maxTanks, Math.max(1, this.number - 10));
            for (let i = 0; i < tankCount; i++) {
                initialEnemies.push(this.tankSpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        // Towers
        if (this.number > 1) {
            const towerCount = Math.max(1, Math.min(2, this.world.number - 3));
            for (let i = 0; i < towerCount; i++) {
                initialEnemies.push(this.towerSpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        // Turrets
        if (this.world.number > 1) {
            const maxTurrets = this.world.number <= 4 ? 1 : 2;
            const turrentCount = Math.min(maxTurrets, Math.max(1, this.number - 15));
            for (let i = 0; i < turrentCount; i++) {
                initialEnemies.push(this.turrentSpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        return initialEnemies;
    }

    spawnCollectables() {
        if (this.boss) {
            return [];
        }

        const collectables = [];
        const spawnCount = Math.ceil(this.world.number + this.number * 0.5);
        const entitiesToAvoid = [this.game.player, ...this.game.enemies];
        for (let i = 0; i < spawnCount; i++) {
            const collectable = this.collectableSpawner.spawnWithoutIntersecting(entitiesToAvoid);
            entitiesToAvoid.push(collectable);
            collectables.push(collectable);
        }
        return collectables;
    }

    isComplete() {
        // Fighting a boss?
        if (this.boss) {
            return this.boss.isDead;
        }

        // Normal level is complete when the player reaches the top
        return this.game.player.isOnTopPlatform();
    }
}
