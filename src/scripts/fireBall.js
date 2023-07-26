import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Mover } from './mover.js';
import { Enemy } from './enemy.js';
import { AudioManager } from './audioManager.js';

export class FireBall extends Enemy {
    constructor(game, x, y, sprite) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.FIRE_BALL.width,
            SpriteLibrary.SIZES.FIRE_BALL.height,
            EnemyTypes.FIRE_BALL,
            sprite,
            false
        );
        this.mover = new Mover(game, this);
        this.mover.setCollideWith({
            walls: false,
            ceiling: false,
            platforms: false,
        });
        this.mover.dropping = true;
        this.gravity = Mover.DEFAULT_GRAVITY * 0.8;
    }

    static spawn(game) {
        game.audioManager.play(AudioManager.AUDIO_FILES.FIRE_BALL);
        return new FireBall(
            game,
            RandomGenerator.randomIntBetween(
                0,
                game.canvas.width - SpriteLibrary.SIZES.FIRE_BALL.width
            ),
            1, // Important: spawn on screen
            SpriteLibrary.fireBall()
        );
    }

    update() {
        super.update();
        if (this.isOffScreen) {
            return;
        }

        this.mover.update();
        this.isOffScreen = this.y > 800; // TODO: reference this.game.height
    }
}
