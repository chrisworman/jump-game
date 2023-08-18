import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes.js';
import { GameState } from './gameState.js';
import { Mover } from './mover.js';
import { Platforms } from './platforms.js';
import { RandomGenerator } from './randomGenerator.js';
import { SpriteLibrary } from './spriteLibrary.js';

export class Chaser extends Enemy {
    static IDLE_SPEED = 5;
    static CHASING_SPEED = 7;
 
    constructor(game, x, y, currentSprite) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.CHASER.width,
            SpriteLibrary.SIZES.CHASER.height,
            20,
            EnemyTypes.CHASER,
            currentSprite,
            true
        );

        this.spriteLeft = currentSprite;
        this.spriteRight = SpriteLibrary.chaserRight();
        this.sprites = [this.spriteLeft, this.spriteRight];

        this.mover = new Mover(game, this);
        this.mover.pace(Chaser.IDLE_SPEED);
        this.wasChasing = false;
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        const player = this.game.player;
        const yDistanceFromPlayer = Math.abs((player.y + player.height) - (this.y + this.height));
        const shouldBeChasing =
            !player.recovering && yDistanceFromPlayer <= 15;
        if (shouldBeChasing && !this.wasChasing) {
            this.wasChasing = true;
            if (player.x > this.x) {
                this.mover.setVelocityX(Chaser.CHASING_SPEED);
            } else {
                this.mover.setVelocityX(-Chaser.CHASING_SPEED);
            }
        } else if (!shouldBeChasing && this.wasChasing) {
            this.wasChasing = false;
            this.mover.setVelocityX(Math.sign(this.mover.velocity.x) * Chaser.IDLE_SPEED);
            this.sprites.forEach((x) => (x.filterManager.hueDegrees = 0));
        }

        if (shouldBeChasing) {
            this.sprites.forEach(
                (x) =>
                    (x.filterManager.hueDegrees =
                        ((Math.sin(0.015 * this.game.gameTime) + 1.0) / 2.0) * 90 + 90)
            );
        }

        this.mover.update();

        if (this.mover.velocity.x > 0 && this.currentSprite !== this.spriteRight) {
            this.currentSprite = this.spriteRight;
        } else if (this.mover.velocity.x < 0 && this.currentSprite !== this.spriteLeft) {
            this.currentSprite = this.spriteLeft;
        }
    }

    static spawn(game, x = null, y = null) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 5);
        return new Chaser(
            game,
            x ?? RandomGenerator.randomIntBetween(
                1,
                game.canvas.width - SpriteLibrary.SIZES.CHASER.width - 1
            ),
            y ?? RandomGenerator.randomFromArray(eligiblePlatformYs) - SpriteLibrary.SIZES.CHASER.height,
            SpriteLibrary.chaserLeft()
        );
    }
}
