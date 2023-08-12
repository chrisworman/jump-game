import { Bomb } from './bomb.js';
import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Emitter } from './emitter.js';
import { RandomGenerator } from './randomGenerator.js';
import { Enemy } from './enemy.js';
import { Platforms } from './platforms.js';
import { GameState } from './gameState.js';

export class Turret extends Enemy {
    constructor(game, x, y) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.TURRET.width,
            SpriteLibrary.SIZES.TURRET.height,
            75,
            EnemyTypes.TURRET,
            SpriteLibrary.turretIdle(),
            true
        );
        this.spriteIdle = SpriteLibrary.turretIdle();
        this.spriteFiring = SpriteLibrary.turretFiring();
        this.sprites = [this.spriteIdle, this.spriteFiring];
        this.spawnPosition = {
            x: x + this.currentSprite.width * 0.5,
            y: y,
        };
        this.bombSpawner = new Emitter(game, {
            emit: () => {
                this.currentSprite = this.spriteFiring;
                this.currentSprite.reset();
                Bomb.spawn(
                    game,
                    this.spawnPosition.x,
                    this.spawnPosition.y,
                    RandomGenerator.randomSign()
                );
            },
            delays: [
                300,
                300,
                300,
                RandomGenerator.randomIntBetween(2000, 3000),
                300,
                300,
                300,
                RandomGenerator.randomIntBetween(2000, 3000),
            ],
        });
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }
        if (this.currentSprite.reachedEnd) {
            this.currentSprite = this.spriteIdle;
            this.currentSprite.reset();
        }
        if (this.game.state === GameState.PLAYING) {
            this.bombSpawner.update();
        }
    }

    static spawn(game) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 5);
        return new Turret(
            game,
            RandomGenerator.randomIntBetween(
                1,
                game.canvas.width - SpriteLibrary.SIZES.TURRET.width - 1
            ),
            RandomGenerator.randomFromArray(eligiblePlatformYs) - SpriteLibrary.SIZES.TURRET.height
        );
    }
}
