import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Platforms } from './platforms.js';
import { Mover } from './mover.js';
import { GameState } from './gameState.js';
import { Game } from './game.js';
import { Rocket } from './rocket.js';

export class Boss3 extends Enemy {
    static SPEED = 4;
    static SHOOT_DELAY_MS = 700;
    constructor(game, x, y, width, height, currentSprite) {
        super(game, x, y, width, height, 900, EnemyTypes.BOSS, currentSprite, true, 3);

        this.spriteLeftIdle = currentSprite;
        this.spriteLeftJump = SpriteLibrary.boss3LeftJump();
        this.spriteRightIdle = SpriteLibrary.boss3RightIdle();
        this.spriteRightJump = SpriteLibrary.boss3RightJump();
        this.sprites = [
            this.spriteLeftIdle,
            this.spriteLeftJump,
            this.spriteRightIdle,
            this.spriteRightJump,
        ];

        this.facingLeft = true;
        this.wasJumping = false;
        this.wasDropping = false;
        const platformYs = Platforms.getPlatformYs();
        this.topPlatformY = platformYs[0];
        this.lastShootTime = game.gameTime;
        this.mover = new Mover(game, this);
    }

    update() {
        super.update();
        if (!this.isDead) {
            this.mover.update();
            if (this.game.state === GameState.PLAYING) {
                // Movement
                if (this.mover.jumping) {
                    // nothing
                } else if (this.mover.dropping) {
                    // nothing
                } else if (!this.facingLeft && this.mover.velocity.x > 0) {
                    // right
                    if (this.x + this.width + 20 >= Game.WORLD_WIDTH) {
                        // near wall, change directions
                        this.facingLeft = true;
                        this.mover.stop();
                        this.currentSprite = this.spriteLeftIdle;
                        this.currentSprite.reset();
                        // console.log('sto')
                    }
                } else if (this.facingLeft && this.mover.velocity.x < 0) {
                    // left
                    if (this.x - 20 <= 0) {
                        // near wall, change directions
                        this.facingLeft = false;
                        this.mover.stop();
                        this.currentSprite = this.facingLeft
                            ? this.spriteLeftIdle
                            : this.spriteRightIdle;
                        this.currentSprite.reset();
                    }
                } else if (this.mover.velocity.x === 0) {
                    // idle

                    console.log('x === 0');

                    if (this.wasJumping) {
                        // Reached top?
                        if (this.y + this.height === this.topPlatformY) {
                            this.wasJumping = false;
                            if (RandomGenerator.randomBool(0.4)) {
                                this.mover.drop();
                                this.wasDropping = true;
                                this.currentSprite = this.facingLeft
                                    ? this.spriteLeftIdle
                                    : this.spriteRightIdle;
                                this.currentSprite.reset();
                            } else {
                                // Walk the direction we are facing
                                this.mover.velocity.x = this.facingLeft
                                    ? -Boss3.SPEED
                                    : Boss3.SPEED;
                                this.currentSprite = this.facingLeft
                                    ? this.spriteLeftIdle
                                    : this.spriteRightIdle;
                                this.currentSprite.reset();
                            }
                        } else {
                            this.mover.jump(-8);
                            this.currentSprite = this.facingLeft
                                ? this.spriteLeftJump
                                : this.spriteRightJump;
                            this.currentSprite.reset();
                        }
                    } else if (this.wasDropping) {
                        // Reached bottom?
                        if (this.onFloor()) {
                            // Walk the direction we are facing
                            this.mover.velocity.x = this.facingLeft ? -Boss3.SPEED : Boss3.SPEED;
                            this.currentSprite = this.facingLeft
                                ? this.spriteLeftIdle
                                : this.spriteRightIdle;
                            this.currentSprite.reset();
                            this.wasDropping = false;
                        } else {
                            this.mover.drop();
                            this.currentSprite = this.facingLeft
                                ? this.spriteLeftIdle
                                : this.spriteRightIdle;
                            this.currentSprite.reset();
                        }
                    } else {
                        // On the top?
                        if (this.y + this.height === this.topPlatformY) {
                            this.mover.drop();
                            this.wasDropping = true;
                            this.currentSprite = this.facingLeft
                                ? this.spriteLeftIdle
                                : this.spriteRightIdle;
                            this.currentSprite.reset();
                        } else if (this.onFloor()) {
                            this.mover.jump(-8);
                            this.wasJumping = true;
                            this.currentSprite = this.facingLeft
                                ? this.spriteLeftJump
                                : this.spriteRightJump;
                            this.currentSprite.reset();
                        } else {
                            // Walk in the direction we are facing
                            this.mover.velocity.x = this.facingLeft ? -Boss3.SPEED : Boss3.SPEED;
                        }
                    }
                }

                // Time to shoot?
                if (
                    (this.wasJumping || this.wasDropping) &&
                    this.game.gameTime - this.lastShootTime >= Boss3.SHOOT_DELAY_MS
                ) {
                    const spawnPosition = {
                        x: this.facingLeft
                            ? this.x - this.currentSprite.width
                            : this.x + this.currentSprite.width,
                        y: this.y + 12,
                    };
                    Rocket.spawn(
                        this.game,
                        spawnPosition.x,
                        spawnPosition.y,
                        this.facingLeft ? -1 : 1
                    );
                    this.lastShootTime = this.game.gameTime;
                }
            }
        }
    }

    static spawn(game, x = null, y = null) {
        const firstPlatformY = Platforms.getPlatformYs()[0];
        return new Boss3(
            game,
            x || Game.WORLD_WIDTH - SpriteLibrary.SIZES.BOSS_3.width - 10,
            y || firstPlatformY - SpriteLibrary.SIZES.BOSS_3.height,
            SpriteLibrary.SIZES.BOSS_3.width,
            SpriteLibrary.SIZES.BOSS_3.height,
            SpriteLibrary.boss3LeftIdle()
        );
    }
}
