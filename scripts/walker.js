import { EnemyTypes } from './enemyTypes.js';
import { Platforms } from './platforms.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Mover } from './mover.js';

export class Walker {
    static SPEED = 2;

    constructor(x, y, initialSpeed, walkingSprite, dyingSprite) {
        this.enemyType = EnemyTypes.WALKER;
        this.isDead = false;
        this.isShot = false;
        this.isShootable = true;
        this.isOffScreen = false;

        this.walkingSprite = walkingSprite;
        this.dyingSprite = dyingSprite;

        this.x = x;
        this.y = y;
        this.width = this.walkingSprite.width;
        this.height = this.walkingSprite.height;
        this.mover = new Mover(this, 0);
        this.mover.setVelocityX(initialSpeed);
    }

    static spawn(canvasWidth) {
        return new Walker(
            RandomGenerator.randomIntBetween(1, canvasWidth - SpriteLibrary.SIZES.WALKER.width - 1),
            RandomGenerator.randomFromArray(Platforms.getPlatformYs()) - SpriteLibrary.SIZES.WALKER.height,
            RandomGenerator.randomSign() * Walker.SPEED,
            SpriteLibrary.walkerWalking(),
            SpriteLibrary.walkerDying()
        );
    }

    render(renderContext) {
        if (this.isDead) {
            return;
        }
        if (this.isShot) {
            this.dyingSprite.render(renderContext, this.x, this.y);
        } else {
            this.walkingSprite.render(renderContext, this.x, this.y);
        }
    }

    update() {
        if (this.isDead) {
            return;
        }
        if (this.isShot) {
            this.isDead = this.dyingSprite.reachedEnd;
            return;
        }

        this.mover.update();

        if (this.x + this.width >= 550) {
            // Change direction
            this.x = this.x - 1;
            this.mover.setVelocityX(-Walker.SPEED);
        } else if (this.x <= 0) {
            this.x = 1;
            this.mover.setVelocityX(Walker.SPEED);
        }
    }

    handleShot() {
        this.isShot = true;
    }
}
