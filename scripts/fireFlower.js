import { Bomb } from './bomb.js';
import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Emitter } from './emitter.js';
import { RandomGenerator } from './randomGenerator.js';
import { Enemy } from './enemy.js';
import { FilterManager } from './filterManager.js';
import { Platforms } from './platforms.js';

export class FireFlower extends Enemy {
    constructor(game, x, y) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.FIRE_BALL.width,
            SpriteLibrary.SIZES.FIRE_BALL.height,
            EnemyTypes.FIRE_FLOWER,
            true
        );
        this.sprite = SpriteLibrary.fireBall(); // TODO: proper sprite
        this.spawnPosition = {
            x: x + this.sprite.width * 0.5,
            y: y,
        };
        this.bombSpawner = new Emitter({
            emit: () => {
                Bomb.spawn(
                    game,
                    this.spawnPosition.x,
                    this.spawnPosition.y,
                    RandomGenerator.randomSign()
                );
            },
            delays: [250, 250, 250, 2000, 250, 250, 250, 2000],
        });
    }

    render(renderContext) {
        if (this.isDead) {
            if (this.sprite.filterManager.animation == null) {
                return;
            }
        }
        this.sprite.render(renderContext, this.x, this.y);
    }

    update() {
        if (this.isDead) {
            return;
        }
        this.bombSpawner.update();
    }

    static spawn(game) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 5);
        return new FireFlower(
            game,
            RandomGenerator.randomIntBetween(
                1,
                game.canvas.width - SpriteLibrary.SIZES.FIRE_BALL.width - 1
            ),
            RandomGenerator.randomFromArray(eligiblePlatformYs) -
                SpriteLibrary.SIZES.FIRE_BALL.height
        );
    }

    handleShot() {
        super.handleShot();
        if (this.isDead) {
            this.sprite.filterManager.animate(FilterManager.blurFadeOutAnimation(), 250);
        }
    }
}
