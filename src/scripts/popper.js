import { Enemy } from './enemy.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Emitter } from './emitter.js';
import { RandomGenerator } from './randomGenerator.js';
import { GameState } from './gameState.js';
import { EnemyTypes } from './enemyTypes.js';
import { Bomb } from './bomb.js';
import { Platforms } from './platforms.js';

export class Popper extends Enemy {
    constructor(game, x, y, spriteIdle) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.POPPER.width,
            SpriteLibrary.SIZES.POPPER.height,
            20,
            EnemyTypes.POPPER,
            spriteIdle,
            true
        );

        this.spriteIdle = spriteIdle;
        this.spriteShoot = SpriteLibrary.popperShoot();
        this.sprites = [this.spriteIdle, this.spriteShoot];
        this.spawnPosition = {
            x: x + this.currentSprite.width * 0.5,
            y: y,
        };
        this.bombSpawner = new Emitter(game, {
            emit: (i) => {
                if (i === 0 || i === 1) {
                    this.currentSprite = this.spriteShoot;
                    this.currentSprite.reset();
                    Bomb.spawn(
                        game,
                        this.spawnPosition.x,
                        this.spawnPosition.y,
                        RandomGenerator.randomSign()
                    );
                } else {
                    this.currentSprite = this.spriteIdle;
                    this.currentSprite.reset();
                }
            },
            delays: [
                RandomGenerator.randomIntBetween(1500, 3000),
                1000,
                800
            ],
        });
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }
        if (this.game.state === GameState.PLAYING) {
            this.bombSpawner.update();
        }
    }

    static spawn(game) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 4);
        return new Popper(
            game,
            RandomGenerator.randomIntBetween(
                1,
                game.canvas.width - SpriteLibrary.SIZES.POPPER.width - 1
            ),
            RandomGenerator.randomFromArray(eligiblePlatformYs) - SpriteLibrary.SIZES.POPPER.height,
            SpriteLibrary.popperIdle()
        );
    }
}
