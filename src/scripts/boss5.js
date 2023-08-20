import { Enemy } from './enemy.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { EnemyTypes } from './enemyTypes.js';
import { GameState } from './gameState.js';
import { AudioManager } from './audioManager.js';
import { Game } from './game.js';
import { Velocity } from './velocity.js';
import { Emitter } from './emitter.js';
import { RandomGenerator } from './randomGenerator.js';
import { Chaser } from './chaser.js';
import { Bomb } from './bomb.js';
import { Bomber } from './bomber.js';

export class Boss5 extends Enemy {
    static HEALTH = 5;
    static SHOOT_DELAY_MS = 1000;
    static FLOAT_DISTANCE_X = 10;
    static FLOAT_DISTANCE_Y = 15;
    static FLOAT_VELOCITY_X = 0.14;
    static FLOAT_VELOCITY_Y = 0.12;
    static SHOOT_SETUP_VELOCITY = 2.3;
    static SHOOT_VELOCITY = 1.6;

    constructor(game, x, y, spriteIdle) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.BOSS_5.width,
            SpriteLibrary.SIZES.BOSS_5.height,
            5000,
            EnemyTypes.FINAL_BOSS,
            spriteIdle,
            true,
            Boss5.HEALTH
        );

        this.spriteIdle = spriteIdle;
        this.spriteShoot = SpriteLibrary.boss5Shoot();
        this.spriteJets = SpriteLibrary.boss5Jets();
        this.sprites = [this.spriteIdle, this.spriteShoot, this.spriteJets];

        this.floating = true;
        this.shooting = false;
        this.shootingLeft = true;
        this.lastShootTime = 0;

        this.ogX = x;
        this.ogY = y;
        this.mover = new Mover(game, this);
        this.mover.setVelocity(new Velocity(Boss5.FLOAT_VELOCITY_X, -Boss5.FLOAT_VELOCITY_Y));

        this.emitter = new Emitter(game, {
            emit: (i) => {
                if (i === 0 || i === 1) {
                    this.currentSprite = this.spriteShoot;

                    if (
                        i === 0 &&
                        this.health <= 3 &&
                        this.game.enemies.filter((x) => x.type === EnemyTypes.BOMBER).length <= 2
                    ) {
                        const bomber = Bomber.spawn(
                            game,
                            this.x +
                                this.width * 0.5 -
                                SpriteLibrary.SIZES.POUNDER.width * 0.5 +
                                RandomGenerator.randomSign() * 50,
                            this.y + this.height
                        );
                        bomber.mover.dropping = true;
                        game.enemies.push(bomber);
                        this.game.stats.shootableEnemyAvailable(bomber.type);
                        this.currentSprite.reset();
                    } else {
                        const chaser = Chaser.spawn(
                            game,
                            this.x + this.width * 0.5 - SpriteLibrary.SIZES.CHASER.width * 0.5,
                            this.y + this.height
                        );
                        chaser.mover.dropping = true;
                        game.enemies.push(chaser);
                        this.game.stats.shootableEnemyAvailable(chaser.type);
                        this.currentSprite.reset();
                    }
                } else if (i === 2) {
                    this.shootingLeft = RandomGenerator.randomBool();
                    this.floating = true;
                    this.currentSprite = this.spriteIdle;
                    this.mover.setVelocity(
                        new Velocity(Boss5.FLOAT_VELOCITY_X, -Boss5.FLOAT_VELOCITY_Y)
                    );
                } else if (i === 3) {
                    this.floating = false;
                    this.currentSprite = this.spriteIdle;
                    this.mover.setVelocityX(
                        this.shootingLeft ? -Boss5.SHOOT_SETUP_VELOCITY : Boss5.SHOOT_SETUP_VELOCITY
                    );
                    this.mover.setVelocityY(0.3);
                } else if (i === 4) {
                    this.shooting = true;
                    this.mover.setVelocityX(
                        this.shootingLeft ? Boss5.SHOOT_VELOCITY : -Boss5.SHOOT_VELOCITY
                    );
                    this.mover.setVelocityY(0);
                } else if (i === 5) {
                    this.shooting = false;
                    this.currentSprite = this.spriteIdle;
                    this.mover.setVelocityX(
                        this.shootingLeft ? -Boss5.SHOOT_SETUP_VELOCITY : Boss5.SHOOT_SETUP_VELOCITY
                    );
                    this.mover.setVelocityY(-0.3);
                } else if (i === 6) {
                    this.floating = true;
                    this.currentSprite = this.spriteIdle;
                    this.floating = true;
                    this.mover.setVelocity(
                        new Velocity(Boss5.FLOAT_VELOCITY_X, -Boss5.FLOAT_VELOCITY_Y)
                    );
                }
            },
            delays: [
                RandomGenerator.randomIntBetween(400, 600), // Wait before spawning
                500, // Wait to spawn another
                500, // Start idle after waiting a bit
                800, // After idle, start moving to shoot position
                900, // Finish moving to shoot position
                2800, // Shoot ... finish shooting
                900, // Move back to idle position
            ],
        });
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        if (this.game.state === GameState.PLAYING) {
            this.mover.update();

            if (this.floating) {
                if (Math.abs(this.x - this.ogX) >= Boss5.FLOAT_DISTANCE_X) {
                    this.mover.setVelocityX(-this.mover.velocity.x);
                }
                if (Math.abs(this.y - this.ogY) >= Boss5.FLOAT_DISTANCE_Y) {
                    this.mover.setVelocityY(-this.mover.velocity.y);
                }
            }

            this.emitter.update();

            if (this.shooting && this.game.gameTime - this.lastShootTime >= Boss5.SHOOT_DELAY_MS) {
                this.currentSprite = this.spriteShoot;
                this.currentSprite.reset();
                Bomb.spawn(
                    this.game,
                    this.x + this.width * 0.05,
                    this.y + this.height,
                    0
                ).mover.stop();
                Bomb.spawn(
                    this.game,
                    this.x + this.width * 0.5,
                    this.y + this.height,
                    0
                ).mover.stop();
                Bomb.spawn(
                    this.game,
                    this.x + this.width * 0.95,
                    this.y + this.height,
                    0
                ).mover.stop();
                this.lastShootTime = this.game.gameTime;
            }
        }

        // Jet animation
        this.spriteJets.filterManager.hueDegrees =
            ((Math.sin(0.001 * this.game.gameTime) + 1.0) / 2.0) * 50 + 120;
        this.spriteJets.filterManager.blurPixels =
            ((Math.sin(0.002 * this.game.gameTime) + 1.0) / 2.0) * 2 + 1.5;
        this.spriteJets.filterManager.brightnessPercent =
            ((Math.sin(0.01 * this.game.gameTime) + 1.0) / 2.0) * 50 + 100;
    }

    handleShot() {
        const wasShot = super.handleShot();
        if (wasShot && !this.isDead) {
            this.game.audioManager.play(AudioManager.SOUNDS.BOSS_5_SHOT);
        }
    }

    render(renderContext) {
        super.render(renderContext);
        if (!this.isDead) {
            this.spriteJets.render(renderContext, this.x, this.y + this.height);
        }
    }

    static spawn(game) {
        const x = Game.WORLD_WIDTH * 0.5 - SpriteLibrary.SIZES.BOSS_5.width * 0.5;
        const y = 25;
        return new Boss5(game, x, y, SpriteLibrary.boss5Idle());
    }
}
