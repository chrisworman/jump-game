import { Gem } from './gem.js';
import { FireBall } from './fireBall.js';
import { Walker } from './walker.js';
import { Turret } from './turret.js';
import { Spawner } from './spawner.js';
import { Tank } from './tank.js';
import { Tower } from './tower.js';
import { LevelManager } from './levelManager.js';
import { Shield } from './shield.js';
import { LaserCollectable } from './laserCollectable.js';
import { Heavy } from './heavy.js';
import { Pounder } from './pounder.js';
import { Chaser } from './chaser.js';

export class Level {
    static MAX_GEMS = 20;
    static MAX_FIRE_BALL_SPAWN_DELAY_MS = 5000;
    static NO_ENEMY_BUFFER = 300;

    constructor(game, number, world, title, platformSprites) {
        this.game = game;
        this.number = number;
        this.world = world;
        this.title = title;
        this.platformSprites = platformSprites;

        this.boss = number === LevelManager.LEVELS_PER_WORLD ? this.world.getBoss() : null;
        this.enemySpawnTime = null;
        this.gemSpawner = new Spawner(() => {
            return Gem.spawn(game);
        });
        this.walkerSpawner = new Spawner(() => {
            return Walker.spawn(game);
        });
        this.pounderSpawner = new Spawner(() => {
            return Pounder.spawn(game);
        });
        this.chaserSpawner = new Spawner(() => {
            return Chaser.spawn(game);
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
        this.heavySpawner = new Spawner(() => {
            return Heavy.spawn(game);
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

        // Walkers: easy
        const walkerCount = Math.min(8, Math.max(1, this.world.number * 2 + this.number - 10));
        for (let i = 0; i < walkerCount; i++) {
            initialEnemies.push(this.walkerSpawner.spawnWithoutIntersecting(initialEnemies));
        }

        // Pounder: easy
        if (
            (this.world.number === 1 && this.number >= 4) ||
            (this.world.number === 3 && this.number >= 2) ||
            (this.world.number === 5 && this.number >= 10)
        ) {
            const pounderCount = this.world.number === 5 && this.number >= 18 ? 2 : 1;
            for (let i = 0; i < pounderCount; i++) {
                initialEnemies.push(this.pounderSpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        // Towers: medium
        if (this.number >= 2) {
            const towerCount = this.world.number === 5 && this.number >= 17 ? 2 : 1;
            for (let i = 0; i < towerCount; i++) {
                initialEnemies.push(this.towerSpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        // Chaser: medium?
        if (
            (this.world.number === 4 && this.number >= 3) ||
            (this.world.number === 5 && this.number >= 2)
        ) {
            initialEnemies.push(this.chaserSpawner.spawnWithoutIntersecting(initialEnemies));
        }

        // Tanks: medium
        if (
            (this.world.number === 2 && this.number >= 4) ||
            (this.world.number === 3 && this.number >= 3) ||
            (this.world.number === 4 && this.number >= 2) ||
            (this.world.number === 5 && this.number >= 1)
        ) {
            const tankCount = this.world.number === 5 && this.number >= 17 ? 2 : 1;
            for (let i = 0; i < tankCount; i++) {
                initialEnemies.push(this.tankSpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        // Heavies: hard
        if (
            (this.world.number === 3 && this.number >= 16) ||
            (this.world.number === 5 && this.number >= 8)
        ) {
            initialEnemies.push(this.heavySpawner.spawnWithoutIntersecting(initialEnemies));
        }

        // Turrets: very hard
        if (this.world.number >= 4 && this.number >= 15) {
            const turrentCount = this.world.number === 5 && this.number >= 17 ? 2 : 1;
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

        // Gems
        const gemCount = Math.min(Level.MAX_GEMS, Math.ceil(this.world.number + this.number * 0.5));
        const entitiesToAvoid = [this.game.player, ...this.game.enemies];
        for (let i = 0; i < gemCount; i++) {
            const gem = this.gemSpawner.spawnWithoutIntersecting(entitiesToAvoid);
            entitiesToAvoid.push(gem);
            collectables.push(gem);
        }

        // Shield
        if (this.number === 9 || this.number === 18) {
            collectables.push(Shield.spawn(this.game));
        }

        // Laser
        if (this.world.number === 5 && this.number === 1) {
            collectables.push(LaserCollectable.spawn(this.game));
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
