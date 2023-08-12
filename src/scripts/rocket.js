import { Velocity } from './velocity.js';
import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { AudioManager } from './audioManager.js';

export class Rocket extends Enemy {
    static SPAWN_SPEED_X = 4;
    static SpawnReusePool = [];

    constructor(game, x, y, velocity) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.ROCKET.width,
            SpriteLibrary.SIZES.ROCKET.height,
            0,
            EnemyTypes.ROCKET,
            SpriteLibrary.rocket(),
            false
        );
        this.mover = new Mover(game, this);
        this.mover.setCollideWith({
            walls: false,
            ceiling: false,
            platforms: false,
        });
        this.mover.setVelocity(velocity);
    }

    update() {
        super.update();
        if (this.isOffScreen) {
            return;
        }

        this.mover.update();

        this.isOffScreen =
            this.y > this.game.canvas.height ||
            this.x > this.game.canvas.width ||
            this.x + this.width < 0;
        if (this.isOffScreen) {
            Rocket.SpawnReusePool.push(this);
        }
    }

    reuse(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.currentSprite.reset();
        this.mover.setVelocity(velocity);
        this.isOffScreen = false;
    }

    /*
        verticalDirection = 1 => left to right
        verticalDirection = -1 => right to left
    */
    static spawn(game, x, y, verticalDirection) {
        const velocity = new Velocity(verticalDirection * Rocket.SPAWN_SPEED_X, 0);
        if (Rocket.SpawnReusePool.length > 0) {
            Rocket.SpawnReusePool.pop().reuse(x, y, velocity);
        } else {
            game.enemies.push(new Rocket(game, x, y, velocity));
        }
        game.audioManager.play(AudioManager.SOUNDS.BOMB); // TODO: rocket specific audio?
    }
}
