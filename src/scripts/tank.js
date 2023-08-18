import { Enemy } from './enemy.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { EnemyTypes } from './enemyTypes.js';
import { Mover } from './mover.js';
import { Bomb } from './bomb.js';
import { RandomGenerator } from './randomGenerator.js';
import { Platforms } from './platforms.js';
import { Emitter } from './emitter.js';
import { GameState } from './gameState.js';

export class Tank extends Enemy {
    static SPEED = 2.6;

    constructor(game, x, y, spriteIdle) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.TANK.width,
            SpriteLibrary.SIZES.TANK.height,
            25,
            EnemyTypes.TANK,
            spriteIdle,
            true
        );

        this.spriteIdle = spriteIdle;
        this.spriteLeft = SpriteLibrary.tankLeft();
        this.spriteRight = SpriteLibrary.tankRight();
        this.spriteBombing = SpriteLibrary.tankBombing();
        this.sprites = [this.spriteIdle, this.spriteLeft, this.spriteRight, this.spriteBombing];
        this.mover = new Mover(game, this);
        this.mover.pace(Tank.SPEED);

        this.bombAndMovementEmitter = new Emitter(game, {
            emit: (index) => {
                if (index === 0) {
                    this.mover.stop();
                    this.currentSprite = this.spriteIdle;
                    this.currentSprite.reset();
                } else if (index === 1) {
                    this.currentSprite = this.spriteBombing;
                    this.currentSprite.reset();
                    Bomb.spawn(
                        game,
                        this.x + this.currentSprite.width * 0.5,
                        this.y,
                        RandomGenerator.randomSign()
                    );
                } else {
                    this.mover.pace(RandomGenerator.randomSign() * Tank.SPEED);
                }
            },
            delays: [
                RandomGenerator.randomIntBetween(3000, 4000),
                1000,
                RandomGenerator.randomIntBetween(1500, 3000),
            ],
        });
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        if (this.game.state === GameState.PLAYING) {
            this.bombAndMovementEmitter.update();
            this.mover.update();
            if (this.mover.isMovingLeft() && this.currentSprite !== this.spriteLeft) {
                this.currentSprite = this.spriteLeft;
                this.currentSprite.reset();
            } else if (this.mover.isMovingRight() && this.currentSprite !== this.spriteRight) {
                this.currentSprite = this.spriteRight;
                this.currentSprite.reset();
            }
        }
    }

    static spawn(game) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 5);
        return new Tank(
            game,
            RandomGenerator.randomIntBetween(
                1,
                game.canvas.width - SpriteLibrary.SIZES.TANK.width - 1
            ),
            RandomGenerator.randomFromArray(eligiblePlatformYs) - SpriteLibrary.SIZES.TANK.height,
            SpriteLibrary.tankIdle()
        );
    }
}
