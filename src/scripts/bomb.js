import { Velocity } from './velocity.js';
import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { AudioManager } from './audioManager.js';

export class Bomb extends Enemy {
    static SPAWN_SPEED_X = 3;
    static SPAWN_SPEED_Y = 8;
    static SpawnReusePool = [];

    constructor(game, x, y, sprite, velocity) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.BOMB.width,
            SpriteLibrary.SIZES.BOMB.height,
            0,
            EnemyTypes.BOMB,
            sprite,
            false
        );
        this.mover = new Mover(game, this);
        this.mover.setCollideWith({
            walls: false,
            ceiling: false,
            platforms: false,
        });
        this.mover.setVelocity(velocity);
        this.mover.dropping = true;
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
            Bomb.SpawnReusePool.push(this);
        }
    }

    reuse(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.currentSprite.reset();
        this.mover.setVelocity(velocity);
        this.isOffScreen = false;
        this.gravity = null;
    }

    /*
        verticalDirection = 1 => left to right
        verticalDirection = -1 => right to left
    */
    static spawn(game, x, y, verticalDirection) {
        const velocity = new Velocity(verticalDirection * Bomb.SPAWN_SPEED_X, -Bomb.SPAWN_SPEED_Y);
        let spawned = null;
        if (Bomb.SpawnReusePool.length > 0) {
            spawned = Bomb.SpawnReusePool.pop();
            spawned.reuse(x, y, velocity);
        } else {
            spawned = new Bomb(game, x, y, SpriteLibrary.bomb(), velocity);
            game.enemies.push(spawned);
        }
        game.audioManager.play(AudioManager.SOUNDS.BOMB);
        return spawned;
    }
}
