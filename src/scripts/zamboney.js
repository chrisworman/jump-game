import { Enemy } from './enemy.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { EnemyTypes } from './enemyTypes.js';
import { Mover } from './mover.js';
import { RandomGenerator } from './randomGenerator.js';
import { Platforms } from './platforms.js';
import { GameState } from './gameState.js';
import { Rocket } from './rocket.js';

export class Zamboney extends Enemy {
    static SPEED = 2.5;

    constructor(game, x, y, spriteLeft) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.ZAMBONEY.width,
            SpriteLibrary.SIZES.ZAMBONEY.height,
            25,
            EnemyTypes.ZAMBONEY,
            spriteLeft,
            true
        );

        this.spriteLeft = spriteLeft;
        this.spriteRight = SpriteLibrary.zamboneyRight();
        this.sprites = [this.spriteLeft, this.spriteRight];

        this.facingLeft = RandomGenerator.randomBool() ? true : false;
        this.currentSprite = this.facingLeft ? this.spriteLeft : this.spriteRight;

        this.mover = new Mover(game, this);
        this.mover.pace(Zamboney.SPEED);
        this.lastShootTime = 0;
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        this.mover.update();

        if (this.mover.velocity.x > 0) {
            this.facingLeft = false;
            this.currentSprite = this.spriteRight;
        } else {
            this.facingLeft = true;
            this.currentSprite = this.spriteLeft;
        }

        if (this.game.state === GameState.PLAYING) {
            const player = this.game.player;
            const yDistanceFromPlayer = Math.abs(player.y + player.height - (this.y + this.height));
            const shouldBeShooting = !player.recovering && yDistanceFromPlayer <= 15;
            // Face the player when shooting
            if (shouldBeShooting) {
                if (player.x >= this.x && this.facingLeft) {
                    this.facingLeft = false;
                    this.currentSprite = this.spriteRight;
                    this.mover.pace(Zamboney.SPEED);
                } else if (player.x < this.x && !this.facingLeft) {
                    this.facingLeft = true;
                    this.currentSprite = this.spriteLeft;
                    this.mover.pace(-Zamboney.SPEED);
                }
            }
            // Fire at player
            if (shouldBeShooting && this.game.gameTime - this.lastShootTime >= 2000) {
                Rocket.spawn(
                    this.game,
                    this.facingLeft ? this.x : this.x + this.width,
                    this.y + this.height * 0.5 - SpriteLibrary.SIZES.BOMB.height * 0.5,
                    this.facingLeft ? -1 : 1
                );
                this.lastShootTime = this.game.gameTime;
            }
        }
    }

    static spawn(game) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 5);
        return new Zamboney(
            game,
            RandomGenerator.randomIntBetween(
                1,
                game.canvas.width - SpriteLibrary.SIZES.ZAMBONEY.width - 1
            ),
            RandomGenerator.randomFromArray(eligiblePlatformYs) -
                SpriteLibrary.SIZES.ZAMBONEY.height,
            SpriteLibrary.zamboneyLeft()
        );
    }
}
