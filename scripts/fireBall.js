import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Mover } from './mover.js';
import { Game } from './game.js';

export class FireBall {
    constructor(x, y, sprite) {
        this.enemyType = EnemyTypes.FIRE_BALL;
        this.isDead = false;
        this.isShot = false;
        this.isShootable = false;
        this.isOffScreen = false;

        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.width = SpriteLibrary.SIZES.FIRE_BALL.width;
        this.height = SpriteLibrary.SIZES.FIRE_BALL.height;
        this.mover = new Mover(this, Game.GRAVITY - 0.1);
    }

    static spawn(canvasWidth) {
        return new FireBall(
            RandomGenerator.randomIntBetween(0, canvasWidth - SpriteLibrary.SIZES.FIRE_BALL.width),
            1, // Important: spawn on screen
            SpriteLibrary.fireBall()
        );
    }

    render(renderContext) {
        if (this.isOffScreen) {
            return;
        }
        this.sprite.render(renderContext, this.x, this.y);
    }

    update() {
        if (this.isOffScreen) {
            return;
        }

        this.mover.update();
        this.isOffScreen = this.y > 800; // TODO: reference this.game.height
    }

    handleShot() {
        /* fireBalls are invincible */
    }
}
