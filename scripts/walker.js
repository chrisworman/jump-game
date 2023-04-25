import { EnemyTypes } from './enemyTypes.js';
import { Platforms } from './platforms.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { randomFromArray, randomIntBetween, randomSign } from './utils.js';

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
        this.speed = initialSpeed;
    }

    static spawn(canvasWidth) {
        return new Walker(
            randomIntBetween(1, canvasWidth - SpriteLibrary.SIZES.WALKER.width - 1),
            randomFromArray(Platforms.getPlatformYs()) - SpriteLibrary.SIZES.WALKER.height,
            randomSign() * Walker.SPEED,
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
        this.x += this.speed;
        if (this.x + this.width >= 550) {
            // Change direction
            this.x = this.x - 1;
            this.speed = -Walker.SPEED;
        } else if (this.x <= 0) {
            this.x = 1;
            this.speed = Walker.SPEED;
        }
    }

    handleShot() {
        this.isShot = true;
    }
}
