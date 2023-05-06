import { Enemy } from './enemy.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Bomb } from './bomb.js';
import { Emitter } from './emitter.js';
import { RandomGenerator } from './randomGenerator.js';
import { Platforms } from './platforms.js';
import { EnemyTypes } from './enemyTypes.js';

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

        this.sprite = SpriteLibrary.boss();

        this.bombSpawner = new Emitter({
            emit: () => {
                Bomb.spawn(
                    game,
                    this.x + this.sprite.width * 0.5,
                    this.y,
                    RandomGenerator.randomSign(),
                    SpriteLibrary.bullet() // TODO: proper sprite
                );
            },
            delays: [200, 200, 200, 3000, 200, 200, 200, 3000],
        });

        // Setup platform behaviour
        this.mover = new Mover(game, this, true, true);
        this.platformChanger = new Emitter({
            emit: () => {
                // TODO: check if on top or bottom platform
                if (RandomGenerator.randomBool(0.5)) {
                    this.mover.jump();
                } else {
                    this.mover.drop();
                }
            },
            randomDelays: { min: 3000, max: 5000 },
        });
        this.mover.setOnPlatform(() => {
            if (RandomGenerator.randomBool(0.5)) {
                this.mover.left(Boss.SPEED);
            } else {
                this.mover.right(Boss.SPEED);
            }
        });
    }

    render(renderContext) {
        if (this.isDead) {
            return;
        }

        this.sprite.render(renderContext, this.x, this.y);
    }

    update() {
        if (this.isDead) {
            return;
        }

        this.mover.update();
        this.platformChanger.update();
        this.bombSpawner.update();
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
