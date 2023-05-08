import { Velocity } from './velocity.js';
import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';

export class Bomb extends Enemy {
    static SPAWN_SPEED_X = 3;
    static SPAWN_SPEED_Y = 8;
    static SpawnReusePool = [];

    constructor(game, x, y, velocity) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.BOMB.width,
            SpriteLibrary.SIZES.BOMB.height,
            EnemyTypes.BOMB,
            false
        );
        this.sprite = SpriteLibrary.bomb();
        this.mover = new Mover(game, this);
        this.mover.setCollideWith({
            walls: false,
            ceiling: false,
            platforms: false,
        });
        this.mover.setVelocity(velocity);
        this.mover.dropping = true;
    }

    render(renderContext) {
        if (this.isOffScreen) {
            return;
        }
        this.sprite.render(renderContext, this.x, this.y);
    }

    update() {
        super.update();
        if (this.isOffScreen) {
            return;
        }

        this.mover.update();

        this.isOffScreen = this.y > this.game.canvas.height;
        if (this.isOffScreen) {
            Bomb.SpawnReusePool.push(this);
        }
    }

    reuse(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.sprite.reset();
        this.mover.setVelocity(velocity);
        this.isOffScreen = false;
    }

    /*
        verticalDirection = 1 => left to right
        verticalDirection = -1 => right to left
    */
    static spawn(game, x, y, verticalDirection) {
        const velocity = new Velocity(verticalDirection * Bomb.SPAWN_SPEED_X, -Bomb.SPAWN_SPEED_Y);
        if (Bomb.SpawnReusePool.length > 0) {
            Bomb.SpawnReusePool.pop().reuse(x, y, velocity);
        } else {
            game.enemies.push(new Bomb(game, x, y, velocity));
        }
    }
}
