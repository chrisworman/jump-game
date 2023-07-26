import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Platforms } from './platforms.js';
import { Emitter } from './emitter.js';
import { Mover } from './mover.js';
import { Bomb } from './bomb.js';

export class Pounder extends Enemy {
    constructor(game, x, y, width, height, currentSprite) {
        super(game, x, y, width, height, EnemyTypes.POUNDER, currentSprite, true);

        this.spriteIdle = currentSprite;
        this.spritePound = SpriteLibrary.pounderPound();
        this.sprites = [this.spriteIdle, this.spritePound];

        this.mover = new Mover(game, this);

        this.emitter = new Emitter(game, {
            emit: (i) => {
                if (i === 0 || i === 7) {
                    this.currentSprite = this.spriteIdle;
                    if (i === 7) {
                        this.currentSprite.reset();
                    }
                    if (this.y + this.height > Platforms.HEIGHT && RandomGenerator.randomBool(0.70)) {
                        this.mover.jump();
                    } else {
                        this.mover.drop();
                    }
                } else if (i >= 1 && i <= 6) {
                    if (i === 1 || i === 3 || i === 5) {
                        this.currentSprite = this.spritePound;
                        this.currentSprite.reset();
                    }
                    if (i === 2 || i === 4 || i === 6) {
                        const bomb = Bomb.spawn(
                            game,
                            this.x + this.width * 0.5 - SpriteLibrary.SIZES.BOMB.width * 0.5,
                            this.y + this.height
                        );
                        bomb.mover.stop();
                    }
                }
            },
            delays: [
                RandomGenerator.randomIntBetween(1500, 3500),
                900,
                900,
                900,
                900,
                900,
                900,
                RandomGenerator.randomIntBetween(500, 1500),
            ],
        });
    }

    update() {
        super.update();
        if (!this.isDead) {
            this.mover.update();
            this.emitter.update();
        }
    }

    static spawn(game) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 3);
        return new Pounder(
            game,
            RandomGenerator.randomIntBetween(
                100,
                game.canvas.width - SpriteLibrary.SIZES.POUNDER.width - 100
            ),
            RandomGenerator.randomFromArray(eligiblePlatformYs) -
                SpriteLibrary.SIZES.POUNDER.height,
            SpriteLibrary.SIZES.POUNDER.width,
            SpriteLibrary.SIZES.POUNDER.height,
            SpriteLibrary.pounderIdle()
        );
    }
}
