import { Enemy } from './enemy.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Bomb } from './bomb.js';
import { Emitter } from './emitter.js';
import { RandomGenerator } from './randomGenerator.js';
import { Platforms } from './platforms.js';
import { EnemyTypes } from './enemyTypes.js';
import { GameState } from './gameState.js';
import { AudioManager } from './audioManager.js';

export class Boss2 extends Enemy {
    static HEALTH = 3;
    static SPEED = 3;
    // static RECOVERY_TIME_MS = 4000;

    constructor(game, x, y, spriteIdle) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.BOSS_2.width,
            SpriteLibrary.SIZES.BOSS_2.height,
            750,
            EnemyTypes.BOSS,
            spriteIdle,
            true,
            Boss2.HEALTH
        );

        this.recovering = false;
        this.recoveringStartTime = null;

        this.spriteIdle = spriteIdle;
        this.spriteJump = SpriteLibrary.boss2Jump();
        this.spriteBomb = SpriteLibrary.boss2Bomb();
        this.sprites = [this.spriteIdle, this.spriteJump, this.spriteBomb];

        this.bombSpawner = new Emitter(game, {
            emit: () => {
                this.currentSprite = this.spriteBomb;
                this.currentSprite.reset();
                Bomb.spawn(
                    game,
                    this.x + this.currentSprite.width * 0.5,
                    this.y,
                    RandomGenerator.randomSign()
                );
            },
            delays: [200, 200, 200, 3000, 200, 200, 200, 3000],
        });

        // Setup platform behaviour
        this.mover = new Mover(game, this);
        this.mover.pace(Boss2.SPEED);
        this.platformChanger = new Emitter(game, {
            emit: () => {
                // TODO: check if on top or bottom platform
                if (RandomGenerator.randomBool(0.5)) {
                    this.currentSprite = this.spriteJump;
                    this.currentSprite.reset();
                    this.mover.jump();
                } else {
                    this.currentSprite = this.spriteIdle;
                    this.currentSprite.reset();
                    this.mover.drop();
                }
            },
            randomDelays: { min: 3000, max: 5000 },
        });
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        if (this.game.state === GameState.PLAYING) {
            this.mover.update();
            this.platformChanger.update();
            this.bombSpawner.update();
        }
    }

    handleShot() {
        const wasShot = super.handleShot();
        if (wasShot && !this.isDead) {
            this.game.audioManager.play(AudioManager.SOUNDS[`BOSS_SHOT_${this.health}`]);
        }
    }

    static spawn(game) {
        const x = RandomGenerator.randomIntBetween(
            1,
            game.canvas.width - SpriteLibrary.SIZES.BOSS_2.width - 1
        );
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 5);
        const y =
            RandomGenerator.randomFromArray(eligiblePlatformYs) - SpriteLibrary.SIZES.BOSS_2.height;
        return new Boss2(game, x, y, SpriteLibrary.boss2Idle());
    }
}
