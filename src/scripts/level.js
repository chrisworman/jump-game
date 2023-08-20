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
import { Bomber } from './bomber.js';
import { Zamboney } from './zamboney.js';

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
        this.lastBigBombTime = null;

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
        this.bomberSpawner = new Spawner(() => {
            return Bomber.spawn(game);
        });
        this.zamboneySpawner = new Spawner(() => {
            return Zamboney.spawn(game);
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
                !this.lastBigBombTime ||
                now - this.lastBigBombTime >=
                    Level.MAX_BIG_BOMB_SPAWN_DELAY_MS - 15 * this.world.number * this.number
            ) {
                this.lastBigBombTime = now;
                this.game.enemies.push(BigBomb.spawn(this.game));
            }
        }
    }

    spawnInitialEnemies() {
        if (this.boss) {
            return [this.boss];
        }

        const initialEnemies = [];

        if (this.world.number === 1) {
            // Walkers
            const walkerLevels = [2, 3, 4, 5, 6, 7, 8, 9, 10];
            if (walkerLevels.indexOf(this.number) >= 0) {
                const walkerCount = Math.max(1, Math.min(5, this.number - 4));
                for (let i = 0; i < walkerCount; i++) {
                    initialEnemies.push(
                        this.walkerSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            // Towers
            const towerLevels = [3, 4, 5, 6, 7, 8, 9, 10];
            if (towerLevels.indexOf(this.number) >= 0) {
                const towerCount = Math.max(1, Math.min(3, this.number - 6));
                for (let i = 0; i < towerCount; i++) {
                    initialEnemies.push(this.towerSpawner.spawnWithoutIntersecting(initialEnemies));
                }
            }

            // Pounder
            const pounderLevels = [4, 5, 6, 7, 8, 9, 10];
            if (pounderLevels.indexOf(this.number) >= 0) {
                const pounderCount = Math.max(1, Math.min(3, this.number - 6));
                for (let i = 0; i < pounderCount; i++) {
                    initialEnemies.push(
                        this.pounderSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }
        }

        if (this.world.number === 2) {
            // Tanks
            const tankLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            if (tankLevels.indexOf(this.number) >= 0) {
                const tankCount = Math.max(1, Math.min(3, this.number - 5));
                for (let i = 0; i < tankCount; i++) {
                    initialEnemies.push(this.tankSpawner.spawnWithoutIntersecting(initialEnemies));
                }
            }

            // Sentries
            const sentryLevels = [3, 4, 5, 6, 7, 8, 9, 10];
            if (sentryLevels.indexOf(this.number) >= 0) {
                const sentryCount = Math.max(1, Math.min(2, this.number - 5));
                for (let i = 0; i < sentryCount; i++) {
                    initialEnemies.push(
                        this.sentrySpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            // Dumper
            const dumperLevels = [4, 5, 6, 7, 8, 9, 10];
            if (dumperLevels.indexOf(this.number) >= 0) {
                const dumperCount = Math.max(1, Math.min(3, this.number - 6));
                for (let i = 0; i < dumperCount; i++) {
                    initialEnemies.push(
                        this.dumperSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }
        }

        if (this.world.number === 3) {
            // Zamboney
            const zamboneyLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            if (zamboneyLevels.indexOf(this.number) >= 0) {
                const zamboneyCount = Math.max(1, Math.min(4, this.number - 6));
                for (let i = 0; i < zamboneyCount; i++) {
                    initialEnemies.push(
                        this.zamboneySpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            // Poppers
            const popperLevels = [3, 4, 5, 6, 7, 8, 9, 10];
            if (popperLevels.indexOf(this.number) >= 0) {
                const popperCount = Math.max(1, Math.min(2, this.number - 5));
                for (let i = 0; i < popperCount; i++) {
                    initialEnemies.push(
                        this.popperSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            // Bomber
            const bomberLevels = [2, 3, 4, 5, 6, 7, 8, 9, 10];
            if (bomberLevels.indexOf(this.number) >= 0) {
                const bomberCount = Math.max(1, Math.min(2, this.number - 6));
                for (let i = 0; i < bomberCount; i++) {
                    initialEnemies.push(
                        this.bomberSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }
        }

        if (this.world.number === 4) {
            // Chasers
            const chaserLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            if (chaserLevels.indexOf(this.number) >= 0) {
                const chaserCount = Math.max(1, Math.min(5, this.number - 1));
                for (let i = 0; i < chaserCount; i++) {
                    initialEnemies.push(
                        this.chaserSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            // Turret
            const turretLevels = [3, 5, 6, 7, 8, 9, 10];
            if (turretLevels.indexOf(this.number) >= 0) {
                const turrentCount = 1;
                for (let i = 0; i < turrentCount; i++) {
                    initialEnemies.push(
                        this.turrentSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            // Heavy
            const heavyLevels = [2, 4, 5, 6, 7, 8, 9, 10];
            if (heavyLevels.indexOf(this.number) >= 0) {
                const heavyCount = Math.max(1, Math.min(2, this.number - 8));
                for (let i = 0; i < heavyCount; i++) {
                    initialEnemies.push(this.heavySpawner.spawnWithoutIntersecting(initialEnemies));
                }
            }
        }

        if (this.world.number === 5) {
            if (this.number === 1) {
                const chaserCount = 8;
                for (let i = 0; i < chaserCount; i++) {
                    initialEnemies.push(
                        this.chaserSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
                const pounderCount = 2;
                for (let i = 0; i < pounderCount; i++) {
                    initialEnemies.push(
                        this.pounderSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            if (this.number === 2) {
                initialEnemies.push(this.bomberSpawner.spawnWithoutIntersecting(initialEnemies));
                const towerCount = 2;
                for (let i = 0; i < towerCount; i++) {
                    initialEnemies.push(this.towerSpawner.spawnWithoutIntersecting(initialEnemies));
                }
                const walkerCount = 3;
                for (let i = 0; i < walkerCount; i++) {
                    initialEnemies.push(
                        this.walkerSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            if (this.number === 3) {
                initialEnemies.push(this.heavySpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.tankSpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.dumperSpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.chaserSpawner.spawnWithoutIntersecting(initialEnemies));
                const popperCount = 2;
                for (let i = 0; i < popperCount; i++) {
                    initialEnemies.push(
                        this.popperSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            if (this.number === 4) {
                initialEnemies.push(this.towerSpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.turrentSpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.zamboneySpawner.spawnWithoutIntersecting(initialEnemies));
                const pounderCount = 3;
                for (let i = 0; i < pounderCount; i++) {
                    initialEnemies.push(
                        this.pounderSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            if (this.number === 5) {
                initialEnemies.push(this.sentrySpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.chaserSpawner.spawnWithoutIntersecting(initialEnemies));
                const walkerCount = 4;
                for (let i = 0; i < walkerCount; i++) {
                    initialEnemies.push(
                        this.walkerSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
                const bomberCount = 2;
                for (let i = 0; i < bomberCount; i++) {
                    initialEnemies.push(
                        this.bomberSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            if (this.number === 6) {
                initialEnemies.push(this.towerSpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.dumperSpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.turrentSpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.zamboneySpawner.spawnWithoutIntersecting(initialEnemies));
                const tankCount = 2;
                for (let i = 0; i < tankCount; i++) {
                    initialEnemies.push(this.tankSpawner.spawnWithoutIntersecting(initialEnemies));
                }
            }

            if (this.number === 7) {
                initialEnemies.push(this.heavySpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.pounderSpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.tankSpawner.spawnWithoutIntersecting(initialEnemies));
                const popperCount = 2;
                for (let i = 0; i < popperCount; i++) {
                    initialEnemies.push(
                        this.popperSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            if (this.number === 8) {
                initialEnemies.push(this.turrentSpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.towerSpawner.spawnWithoutIntersecting(initialEnemies));
                const chaserCount = 8;
                for (let i = 0; i < chaserCount; i++) {
                    initialEnemies.push(
                        this.chaserSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            if (this.number === 9) {
                initialEnemies.push(this.zamboneySpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.dumperSpawner.spawnWithoutIntersecting(initialEnemies));
                const walkerCount = 4;
                for (let i = 0; i < walkerCount; i++) {
                    initialEnemies.push(
                        this.walkerSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
                const bomberCount = 2;
                for (let i = 0; i < bomberCount; i++) {
                    initialEnemies.push(
                        this.bomberSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }

            if (this.number === 10) {
                initialEnemies.push(this.heavySpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.towerSpawner.spawnWithoutIntersecting(initialEnemies));
                initialEnemies.push(this.popperSpawner.spawnWithoutIntersecting(initialEnemies));
                const pounderCount = 2;
                for (let i = 0; i < pounderCount; i++) {
                    initialEnemies.push(
                        this.pounderSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
                const zamboneyCount = 2;
                for (let i = 0; i < zamboneyCount; i++) {
                    initialEnemies.push(
                        this.zamboneySpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
                const chaserCount = 3;
                for (let i = 0; i < chaserCount; i++) {
                    initialEnemies.push(
                        this.chaserSpawner.spawnWithoutIntersecting(initialEnemies)
                    );
                }
            }
        }

        initialEnemies.forEach((x) => {
            if (x.isShootable) {
                this.game.stats.shootableEnemyAvailable(x.type);
            }
        });

        return initialEnemies;
    }

    spawnCollectables() {
        const collectables = [];

        // Laser: always ensure the laser is available on world 5 levels,
        // which is mostly for testing, esp. the final boss
        if (this.world.number === 5 && !this.game.player.laserGun) {
            collectables.push(LaserCollectable.spawn(this.game));
        }

        // No other collectables when there is a boss
        if (this.boss) {
            return collectables;
        }

        // Gems
        const gemCount = Math.min(Level.MAX_GEMS, Math.ceil(this.world.number + this.number * 0.7));
        const entitiesToAvoid = [this.game.player, ...this.game.enemies];
        for (let i = 0; i < gemCount; i++) {
            const gem = this.gemSpawner.spawnWithoutIntersecting(entitiesToAvoid);
            entitiesToAvoid.push(gem);
            collectables.push(gem);
        }

        this.game.stats.gemsAvailable(gemCount);

        // Shield
        if (this.number === 8) {
            collectables.push(Shield.spawn(this.game));
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
