import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Mover } from './mover.js';
import { Game } from './game.js';
import { Enemy } from './enemy.js';

export class FireBall extends Enemy {
    constructor(x, y, sprite) {
        super(
            x,
            y,
            SpriteLibrary.SIZES.FIRE_BALL.width,
            SpriteLibrary.SIZES.FIRE_BALL.height,
            EnemyTypes.FIRE_BALL,
            false
        );
        this.sprite = sprite;
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
}
