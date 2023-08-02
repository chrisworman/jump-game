import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Enemy } from './enemy.js';
import { Platforms } from './platforms.js';
import { Rocket } from './rocket.js';
import { GameState } from './gameState.js';
import { Bomb } from './bomb.js';

export class Sentry extends Enemy {
    static STATES = {
        IDLE: 0,
        SHOOTING_LEFT: 1,
        SHOOTING_RIGHT: 2,
    };
    static SHOOT_INTERVAL_MS = 1000;
    static SHOOT_DETECTION_Y_DISTANCE = 15;

    constructor(game, x, y, spriteIdle) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.SENTRY.width,
            SpriteLibrary.SIZES.SENTRY.height,
            EnemyTypes.SENTRY,
            spriteIdle,
            true
        );

        this.state = Sentry.STATES.IDLE;
        this.lastShootTime = null;
        this.spriteIdle = spriteIdle;
        this.spriteShootLeft = SpriteLibrary.sentryShootLeft();
        this.spriteShootRight = SpriteLibrary.sentryShootRight();
        this.sprites = [spriteIdle, this.spriteShootLeft, this.spriteShootRight];
        this.spawnLeftPosition = {
            x: x - SpriteLibrary.SIZES.BOMB.width,
            y: y,
        };
        this.spawnRightPosition = {
            x: x + SpriteLibrary.SIZES.SENTRY.width,
            y: y,
        };
    }

    update() {
        super.update();
        if (this.isDead || this.game.state !== GameState.PLAYING) {
            return;
        }

        const player = this.game.player;
        const yDistanceFromPlayer = Math.abs((player.y + player.height) - (this.y + this.height));
        const shouldBeShooting = yDistanceFromPlayer <= Sentry.SHOOT_DETECTION_Y_DISTANCE;

        if (this.state === Sentry.STATES.IDLE) {
            if (shouldBeShooting) {
                if (player.x > this.x) {
                    this.state = Sentry.STATES.SHOOTING_RIGHT;
                    this.currentSprite = this.spriteShootRight;
                } else {
                    this.state = Sentry.STATES.SHOOTING_LEFT;
                    this.currentSprite = this.spriteShootLeft;
                }
            }
        } else {
            if (!shouldBeShooting) {
                this.state = Sentry.STATES.IDLE;
                this.currentSprite = this.spriteIdle;
                return;
            }

            if (
                !this.lastShootTime ||
                this.game.gameTime - this.lastShootTime >= Sentry.SHOOT_INTERVAL_MS
            ) {
                const spawnPosition =
                    this.state === Sentry.STATES.SHOOTING_LEFT
                        ? this.spawnLeftPosition
                        : this.spawnRightPosition;
                const bomb = Bomb.spawn(
                    this.game,
                    spawnPosition.x,
                    spawnPosition.y,
                    this.state === Sentry.STATES.SHOOTING_RIGHT ? 1 : -1
                );
                const xDistanceFromPlayer = Math.abs(player.x - this.x);
                bomb.mover.setVelocityX(bomb.mover.velocity.x * xDistanceFromPlayer / 140.0);
                bomb.mover.setVelocityY(bomb.mover.velocity.y * 0.6);
                this.lastShootTime = this.game.gameTime;
                this.currentSprite.reset();
            }
        }
    }

    static spawn(game) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 5);
        const x = RandomGenerator.randomBool()
            ? RandomGenerator.randomIntBetween(1, Math.ceil(game.canvas.width * 0.1))
            : RandomGenerator.randomIntBetween(
                  Math.ceil(game.canvas.width * 0.9),
                  game.canvas.width - SpriteLibrary.SIZES.SENTRY.width - 1
              );
        return new Sentry(
            game,
            x,
            RandomGenerator.randomFromArray(eligiblePlatformYs) - SpriteLibrary.SIZES.SENTRY.height,
            SpriteLibrary.sentryIdle()
        );
    }
}
