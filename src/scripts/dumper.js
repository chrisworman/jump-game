import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Mover } from './mover.js';
import { Emitter } from './emitter.js';
import { RandomGenerator } from './randomGenerator.js';
import { GameState } from './gameState.js';
import { Platforms } from './platforms.js';
import { Bomb } from './bomb.js';

export class Dumper extends Enemy {
    constructor(game, x, y, spriteIdle) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.DUMPER.width,
            SpriteLibrary.SIZES.DUMPER.height,
            15,
            EnemyTypes.DUMPER,
            spriteIdle,
            true
        );

        this.currentSprite = spriteIdle;
        this.spriteIdle = spriteIdle;
        this.spriteShoot = SpriteLibrary.dumperShoot();
        this.sprites = [this.spriteIdle, this.spriteShoot];

        this.mover = new Mover(game, this);

        this.emitter = new Emitter(game, {
            emit: (i) => {
                if (i === 0 || i === 2) {
                    this.currentSprite = this.spriteIdle;
                    this.mover.jump(-3);
                    this.mover.setVelocityX(RandomGenerator.randomBool() ? -2 : 2);
                } else if (i === 1 || i === 3) {
                    this.currentSprite = this.spriteShoot;
                    this.currentSprite.reset();
                    const bomb = Bomb.spawn(
                        game,
                        this.x + this.width * 0.5 - SpriteLibrary.SIZES.BOMB.width * 0.5,
                        this.y + this.height
                    );
                    bomb.mover.stop();
                }
            },
            delays: [
                RandomGenerator.randomIntBetween(900, 1500),
                RandomGenerator.randomIntBetween(1500, 2500),
                RandomGenerator.randomIntBetween(900, 1500),
                RandomGenerator.randomIntBetween(1500, 2500),
            ],
        });
    }

    update() {
        super.update();
        if (!this.isDead) {
            this.mover.update();
            if (this.game.state === GameState.PLAYING) {
                this.emitter.update();
            }
        }
    }

    static spawn(game) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 3);
        return new Dumper(
            game,
            RandomGenerator.randomIntBetween(
                100,
                game.canvas.width - SpriteLibrary.SIZES.DUMPER.width - 100
            ),
            RandomGenerator.randomFromArray(eligiblePlatformYs) - SpriteLibrary.SIZES.DUMPER.height,
            SpriteLibrary.dumperIdle()
        );
    }
}
