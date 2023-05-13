import { Enemy } from './enemy.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { EnemyTypes } from './enemyTypes.js';
import { Mover } from './mover.js';
import { Bomb } from './bomb.js';
import { RandomGenerator } from './randomGenerator.js';
import { Platforms } from './platforms.js';
import { Emitter } from './emitter.js';
import { GameState } from './gameState.js';
import { FilterManager } from './filterManager.js';

export class Tank extends Enemy {
    static SPEED = 2.5;

    constructor(game, x, y) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.TANK.width,
            SpriteLibrary.SIZES.TANK.height,
            EnemyTypes.TANK,
            true
        );

        this.spriteIdle = SpriteLibrary.tankIdle();
        this.spriteLeft = SpriteLibrary.tankLeft();
        this.spriteRight = SpriteLibrary.tankRight();
        this.spriteBombing = SpriteLibrary.tankBombing();
        this.spriteCurrent = this.spriteIdle;
        this.sprites = [this.spriteIdle, this.spriteLeft, this.spriteRight, this.spriteBombing];
        this.mover = new Mover(game, this);
        this.mover.pace(Tank.SPEED);

        this.bombAndMovementEmitter = new Emitter({
            emit: (index) => {
                if (index === 0) {
                    this.mover.stop();
                    this.spriteCurrent = this.spriteIdle;
                    this.spriteCurrent.reset();
                } else if (index === 1) {
                    this.spriteCurrent = this.spriteBombing;
                    this.spriteCurrent.reset();
                    Bomb.spawn(
                        game,
                        this.x + this.spriteCurrent.width * 0.5,
                        this.y,
                        RandomGenerator.randomSign()
                    );
                } else {
                    this.mover.pace(RandomGenerator.randomSign() * Tank.SPEED);
                }
            },
            delays: [RandomGenerator.randomIntBetween(3000, 6000), 1000, 2000],
        });
    }

    render(renderContext) {
        if (this.isDead) {
            if (this.spriteCurrent.filterManager.animation == null) {
                return;
            }
        }

        this.spriteCurrent.render(renderContext, this.x, this.y);
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        if (this.game.state === GameState.PLAYING) {
            this.bombAndMovementEmitter.update();
            this.mover.update();
            if (this.mover.isMovingLeft() && this.spriteCurrent !== this.spriteLeft) {
                this.spriteCurrent = this.spriteLeft;
                this.spriteCurrent.reset();
            } else if (this.mover.isMovingRight() && this.spriteCurrent !== this.spriteRight) {
                this.spriteCurrent = this.spriteRight;
                this.spriteCurrent.reset();
            }
        }
    }

    handleShot() {
        super.handleShot();
        if (this.isDead) {
            this.spriteCurrent.filterManager.animate(FilterManager.blurFadeOutAnimation(), 250);
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
            RandomGenerator.randomFromArray(eligiblePlatformYs) - SpriteLibrary.SIZES.TANK.height
        );
    }
}
