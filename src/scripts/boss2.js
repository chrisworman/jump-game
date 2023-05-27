import { Enemy } from './enemy.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Platforms } from './platforms.js';
import { EnemyTypes } from './enemyTypes.js';
import { GameState } from './gameState.js';
import { FilterManager } from './filterManager.js';
import { Emitter } from './emitter.js';
import { Bomb } from './bomb.js';

export class Boss2 extends Enemy {
    static HEALTH = 3;
    static SPEED = 4;
    static CHASINGS_SPEED = 7;
    static RECOVERY_TIME_MS = 4000;
    static BOMB_VEL_XS = [-1, 1, 0.5, -0.5, 0.3, -0.3];

    constructor(game, x, y) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.BOSS_2.width,
            SpriteLibrary.SIZES.BOSS_2.height,
            EnemyTypes.BOSS,
            true,
            Boss2.HEALTH
        );

        this.recovering = false;
        this.recoveringStartTime = null;

        this.spritePace = SpriteLibrary.boss2Pace();
        this.spriteShoot = SpriteLibrary.boss2Shoot();
        this.spriteCurrent = this.spritePace;
        this.sprites = [this.spritePace, this.spriteShoot];
        this.mover = new Mover(game, this);
        this.mover.pace(Boss2.SPEED);
        this.chasingPlayer = false;

        this.emitter = new Emitter(game, {
            emit: (index) => {
                if (this.chasingPlayer) {
                    return;
                }
                if (index === 0) {
                    this.spriteCurrent = this.spriteShoot;
                    this.spriteCurrent.reset();
                    this.mover.stop();
                }
                if (index >= 1 && index <= 3) {
                    const bomb = Bomb.spawn(
                        this.game,
                        this.x + this.width * 0.5,
                        this.y + this.height,
                        0
                    );
                    bomb.mover.setVelocityX(RandomGenerator.randomFromArray(Boss2.BOMB_VEL_XS));
                    bomb.mover.setVelocityY(0);
                }
                if (index === 4) {
                    this.spriteCurrent = this.spritePace;
                    this.spriteCurrent.reset();
                    this.mover.pace(Boss2.SPEED);
                }
            },
            delays: [2000, 400, 300, 300, 400],
        });
    }

    render(renderContext) {
        if (this.isDead) {
            return;
        }

        this.spriteCurrent.render(renderContext, this.x, this.y);
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        if (this.game.state === GameState.PLAYING) {
            // Done recovering?
            if (
                this.recovering &&
                this.game.gameTime - this.recoveringStartTime > Boss2.RECOVERY_TIME_MS
            ) {
                this.recovering = false;
                this.recoveringStartTime = null;
                this.sprites.forEach((x) => x.filterManager.reset());
            }

            this.chasingPlayer =
                this.game.player.y + this.game.player.height === this.y + this.height;
            if (this.chasingPlayer) {
                if (this.game.player.x > this.x) {
                    this.mover.setVelocityX(Boss2.CHASINGS_SPEED);
                } else {
                    this.mover.setVelocityX(-Boss2.CHASINGS_SPEED);
                }
            }

            this.mover.update();
            this.emitter.update();
        }
    }

    handleShot() {
        if (this.recovering) {
            return;
        }
        const wasShot = super.handleShot();
        if (wasShot && !this.isDead) {
            this.recovering = true;
            this.recoveringStartTime = this.game.gameTime;
            const recoveringAnimation = FilterManager.recoveringAnimation();
            this.sprites.forEach((x) =>
                x.filterManager.animate(
                    recoveringAnimation,
                    this.game.gameTime,
                    Boss2.RECOVERY_TIME_MS
                )
            );
        }
    }

    static spawn(game, levelNumber) {
        // TODO: switch on level number and add more parameters to constructor
        const x = RandomGenerator.randomIntBetween(
            1,
            game.canvas.width - SpriteLibrary.SIZES.BOSS_2.width - 1
        );
        const y = Platforms.getPlatformYs()[1] - SpriteLibrary.SIZES.BOSS_2.height;
        return new Boss2(game, x, y);
    }
}
