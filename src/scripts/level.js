import { Gem } from './gem.js';
import { BigBomb } from './bigBomb.js';
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
import { Sentry } from './sentry.js';
import { Dumper } from './dumper.js';
import { Popper } from './popper.js';

export class Level {
    static MAX_GEMS = 20;
    static MAX_BIG_BOMB_SPAWN_DELAY_MS = 5000;
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
        this.sentrySpawner = new Spawner(() => {
            return Sentry.spawn(game);
        });
        this.heavySpawner = new Spawner(() => {
            return Heavy.spawn(game);
        });
        this.dumperSpawner = new Spawner(() => {
            return Dumper.spawn(game);
        });
        this.popperSpawner = new Spawner(() => {
            return Popper.spawn(game);
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
                    Level.MAX_BIG_BOMB_SPAWN_DELAY_MS - 15 * this.world.number * this.number
            ) {
                this.enemySpawnTime = now;
                this.game.enemies.push(BigBomb.spawn(this.game));
            }
        }
    }

    spawnInitialEnemies() {
        if (this.boss) {
            return [this.boss];
        }

        const initialEnemies = [];

        // Walkers: easy
        const walkerCount = Math.min(7, Math.max(1, this.world.number * 2 + this.number - 10));
        for (let i = 0; i < walkerCount; i++) {
            initialEnemies.push(this.walkerSpawner.spawnWithoutIntersecting(initialEnemies));
        }

        // Pounder: easy
        // * Level 1
        if (
            (this.world.number === 1 && [2, 4, 5, 10, 12, 13, 14, 15, 16, 17, 18, 19].indexOf(this.number) >= 0) ||
            (this.world.number === 2 && [6, 8, 11, 12, 17].indexOf(this.number) >= 0) ||
            (this.world.number === 3 && [5, 7, 12, 17].indexOf(this.number) >= 0) ||
            (this.world.number === 4 && [3, 6, 13, 15, 18].indexOf(this.number) >= 0) ||
            (this.world.number === 5 && [3, 4, 5, 6, 9, 12, 13, 15, 17, 19].indexOf(this.number) >= 0)
        ) {
            const pounderCount = 1;
            for (let i = 0; i < pounderCount; i++) {
                initialEnemies.push(this.pounderSpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        // Towers: easy
        // * Level 2
        if (
            (this.world.number <= 2 && [2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].indexOf(this.number) >= 0) ||
            (this.world.number === 4 && [3, 4, 7, 12, 17, 19].indexOf(this.number) >= 0) ||
            (this.world.number === 5 && [5, 7, 9, 14, 15, 18, 19].indexOf(this.number) >= 0)
        ) {
            const towerCount = 1;
            for (let i = 0; i < towerCount; i++) {
                initialEnemies.push(this.towerSpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        // Sentries: medium
        // * Level 3
        if (
            (this.world.number === 3 && [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].indexOf(this.number) >= 0) ||
            (this.world.number === 4 && [4, 5, 7, 8, 10, 11, 15, 16, 18].indexOf(this.number) >= 0) ||
            (this.world.number === 5 && [3, 5, 7, 9, 10, 11, 15, 16, 17, 19].indexOf(this.number) >= 0)
        ) {
            const sentryCount = 1;
            for (let i = 0; i < sentryCount; i++) {
                initialEnemies.push(this.sentrySpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        // Dumper: ??
        if (true) {
            const dumperCount = 1;
            for (let i = 0; i < dumperCount; i++) {
                initialEnemies.push(this.dumperSpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        // Chaser: medium
        // * Level 4
        if (
            (this.world.number === 3 && [6, 8, 12, 15, 16, 19].indexOf(this.number) >= 0) ||
            (this.world.number === 4 && [2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].indexOf(this.number) >= 0) ||
            (this.world.number === 5 && [4, 6, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 19].indexOf(this.number) >= 0)
        ) {
            initialEnemies.push(this.chaserSpawner.spawnWithoutIntersecting(initialEnemies));
        }

        // Tanks: medium
        // * Level 2
        if (
            (this.world.number <= 2 && [3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].indexOf(this.number) >= 0) ||
            (this.world.number === 3 && [2, 5, 6, 7, 9, 11, 14, 15, 17, 18, 19].indexOf(this.number) >= 0) ||
            (this.world.number === 4 && [3, 4, 6, 8, 9, 11, 12, 15, 17, 18].indexOf(this.number) >= 0) ||
            (this.world.number === 5 && [2, 4, 5, 6, 8, 10, 12, 13, 15, 16, 18, 19].indexOf(this.number) >= 0)
        ) {
            const tankCount = 1;
            for (let i = 0; i < tankCount; i++) {
                initialEnemies.push(this.tankSpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        // Heavies: very hard
        // * Level 5
        if (
            (this.world.number === 4 && [17, 18].indexOf(this.number) >= 0) ||
            (this.world.number === 5 && [5, 7, 9, 11, 12, 13, 14, 16, 18].indexOf(this.number) >= 0)
        ) {
            initialEnemies.push(this.heavySpawner.spawnWithoutIntersecting(initialEnemies));
        }

        // Popper
        if (true) {
            const popperCount = 1;
            for (let i = 0; i < popperCount; i++) {
                initialEnemies.push(this.popperSpawner.spawnWithoutIntersecting(initialEnemies));
            }
        }

        // Turrets: very hard
        // * Level 5
        if (
            (this.world.number === 4 && [17, 19].indexOf(this.number) >= 0) ||
            (this.world.number === 5 && ([6, 8, 10, 15, 17, 19].indexOf(this.number) >= 0))
        ) {
            const turrentCount = 1;
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
