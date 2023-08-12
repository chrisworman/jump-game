import { EnemyTypes } from './enemyTypes.js';
import { Platforms } from './platforms.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Mover } from './mover.js';
import { Enemy } from './enemy.js';

export class Walker extends Enemy {
    static SPEED = 2;

    constructor(game, x, y, initialSpeed, walkingSprite, dyingSprite) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.WALKER.width,
            SpriteLibrary.SIZES.WALKER.height,
            5,
            EnemyTypes.WALKER,
            walkingSprite,
            true
        );
        this.walkingSprite = walkingSprite;
        this.dyingSprite = dyingSprite;
        this.sprites = [this.walkingSprite, this.dyingSprite];
        this.mover = new Mover(game, this);
        this.mover.pace(initialSpeed);
    }

    update() {
        super.update();
        if (this.isDead) {
            if (this.currentSprite === this.walkingSprite) {
                this.currentSprite = this.dyingSprite;
                this.currentSprite.filterManager = this.walkingSprite.filterManager;
            }
            return;
        }

        this.mover.update();
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
}
