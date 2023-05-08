import { Enemy } from './enemy.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Bomb } from './bomb.js';
import { Emitter } from './emitter.js';
import { RandomGenerator } from './randomGenerator.js';
import { Platforms } from './platforms.js';
import { EnemyTypes } from './enemyTypes.js';
import { GameState } from './gameState.js';

export class Boss extends Enemy {
    static HEALTH = 3;
    static SPEED = 3;

    constructor(game, x, y) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.BOSS.width,
            SpriteLibrary.SIZES.BOSS.height,
            EnemyTypes.BOSS,
            true,
            Boss.HEALTH
        );

        this.spriteIdle = SpriteLibrary.bossIdle();
        this.spriteJump = SpriteLibrary.bossJump();
        this.spriteBomb = SpriteLibrary.bossBomb();
        this.spriteCurrent = this.spriteIdle;

        this.bombSpawner = new Emitter({
            emit: () => {
                this.spriteCurrent = this.spriteBomb;
                this.spriteCurrent.reset();
                Bomb.spawn(
                    game,
                    this.x + this.spriteCurrent.width * 0.5,
                    this.y,
                    RandomGenerator.randomSign(),
                );
            },
            delays: [200, 200, 200, 3000, 200, 200, 200, 3000],
        });

        // Setup platform behaviour
        this.mover = new Mover(game, this);
        this.mover.pace(Boss.SPEED);
        this.platformChanger = new Emitter({
            emit: () => {
                // TODO: check if on top or bottom platform
                if (RandomGenerator.randomBool(0.5)) {
                    this.spriteCurrent = this.spriteJump;
                    this.spriteCurrent.reset();
                    this.mover.jump();
                } else {
                    this.spriteCurrent = this.spriteIdle;
                    this.spriteCurrent.reset();
                    this.mover.drop();
                }
            },
            randomDelays: { min: 3000, max: 5000 },
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
            this.mover.update();
            this.platformChanger.update();
            this.bombSpawner.update();
        }
    }

    static spawn(game, levelNumber) {
        // TODO: switch on level number and add more parameters to constructor
        const x = RandomGenerator.randomIntBetween(
            1,
            game.canvas.width - SpriteLibrary.SIZES.BOSS.width - 1
        );
        const y =
            RandomGenerator.randomFromArray(Platforms.getPlatformYs()) -
            SpriteLibrary.SIZES.BOSS.height;
        return new Boss(game, x, y);
    }
}
