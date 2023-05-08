import { EnemyTypes } from './enemyTypes.js';
import { Platforms } from './platforms.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Mover } from './mover.js';
import { Enemy } from './enemy.js';
import { Emitter } from './emitter.js';

export class Walker extends Enemy {
    static SPEED = 2;

    constructor(game, x, y, initialSpeed, walkingSprite, dyingSprite) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.WALKER.width,
            SpriteLibrary.SIZES.WALKER.height,
            EnemyTypes.WALKER,
            true
        );
        this.walkingSprite = walkingSprite;
        this.dyingSprite = dyingSprite;
        this.mover = new Mover(game, this);
        this.mover.pace(initialSpeed);
    }

    static spawn(game) {
        return new Walker(
            game,
            RandomGenerator.randomIntBetween(1, game.canvas.width - SpriteLibrary.SIZES.WALKER.width - 1),
            RandomGenerator.randomFromArray(Platforms.getPlatformYs()) -
                SpriteLibrary.SIZES.WALKER.height,
            RandomGenerator.randomSign() * Walker.SPEED,
            SpriteLibrary.walkerWalking(),
            SpriteLibrary.walkerDying()
        );
    }

    render(renderContext) {
        if (this.isDead) {
            if (!this.dyingSprite.reachedEnd) {
                this.dyingSprite.render(renderContext, this.x, this.y);
            }
        } else {
            this.walkingSprite.render(renderContext, this.x, this.y);
        }
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        this.mover.update();
    }
}
