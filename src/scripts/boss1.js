import { Enemy } from './enemy.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Platforms } from './platforms.js';
import { EnemyTypes } from './enemyTypes.js';
import { GameState } from './gameState.js';
import { Emitter } from './emitter.js';
import { Bomb } from './bomb.js';
import { AudioManager } from './audioManager.js';

export class Boss1 extends Enemy {
    static HEALTH = 3;
    static SPEED = 5;
    static CHASINGS_SPEED = 7;
    static BOMB_VEL_XS = [-1, 1, 0.5, -0.5, 0.3, -0.3];

    constructor(game, x, y) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.BOSS_1.width,
            SpriteLibrary.SIZES.BOSS_1.height,
            500,
            EnemyTypes.BOSS,
            SpriteLibrary.boss1Pace(),
            true,
            Boss1.HEALTH
        );

        this.recovering = false;
        this.recoveringStartTime = null;

        this.spritePace = SpriteLibrary.boss1Pace();
        this.spriteShoot = SpriteLibrary.boss1Shoot();
        this.sprites = [this.spritePace, this.spriteShoot];
        this.mover = new Mover(game, this);
        this.mover.pace(Boss1.SPEED);
        this.chasingPlayer = false;

        this.emitter = new Emitter(game, {
            emit: (index) => {
                if (this.chasingPlayer) {
                    return;
                }
                if (index === 0) {
                    this.currentSprite = this.spriteShoot;
                    this.currentSprite.reset();
                    this.mover.stop();
                }
                if (index >= 1 && index <= 3) {
                    const bomb = Bomb.spawn(
                        this.game,
                        this.x + this.width * 0.5,
                        this.y + this.height,
                        0
                    );
                    bomb.mover.setVelocityX(RandomGenerator.randomFromArray(Boss1.BOMB_VEL_XS));
                    bomb.mover.setVelocityY(0);
                }
                if (index === 4) {
                    this.currentSprite = this.spritePace;
                    this.currentSprite.reset();
                    this.mover.pace(Boss1.SPEED);
                }
            },
            delays: [2000, 400, 300, 300, 400],
        });
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        if (this.game.state === GameState.PLAYING) {
            const player = this.game.player;
            this.chasingPlayer =
                !player.recovering && player.y + player.height === this.y + this.height;
            if (this.chasingPlayer) {
                if (player.x > this.x) {
                    this.mover.setVelocityX(Boss1.CHASINGS_SPEED);
                } else {
                    this.mover.setVelocityX(-Boss1.CHASINGS_SPEED);
                }
            }

            this.mover.update();
            this.emitter.update();
        }
    }

    // TODO: introduce Boss and inherit
    handleShot() {
        const wasShot = super.handleShot();
        if (wasShot && !this.isDead) {
            this.game.audioManager.play(AudioManager.SOUNDS[`BOSS_SHOT_${this.health}`]);
        }
    }

    static spawn(game) {
        const x = RandomGenerator.randomIntBetween(
            1,
            game.canvas.width - SpriteLibrary.SIZES.BOSS_1.width - 1
        );
        const y = Platforms.getPlatformYs()[0] - SpriteLibrary.SIZES.BOSS_1.height;
        return new Boss1(game, x, y);
    }
}
