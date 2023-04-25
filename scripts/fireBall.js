import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { randomIntBetween } from './utils.js';
import { Velocity } from './components.js';

export class FireBall {
    constructor(x, y, gravity, sprite) {
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
        this.gravity = gravity - 0.1; // TODO
        this.velocity = new Velocity();
    }

    static spawn(canvasWidth, gravity) {
        return new FireBall(
            randomIntBetween(0, canvasWidth - SpriteLibrary.SIZES.FIRE_BALL.width),
            0,
            gravity,
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
        this.velocity.y += this.gravity;
        this.y += this.velocity.y;
        this.x += this.velocity.x;
        this.isOffScreen = this.y > 800; // TODO: reference this.game.height
    }

    handleShot() {
        /* fireBalls are invincible */
    }
}
