import { SpriteLibrary } from './spriteLibrary.js';
import { Mover } from './mover.js';
import { Entity } from './entity.js';

export class Bullet extends Entity {
    static SPEED = 8;
    static SpawnReusePool = [];

    constructor(game, x, y, sprite, speed) {
        super(game, x, y, SpriteLibrary.SIZES.BULLET.width, SpriteLibrary.SIZES.BULLET.height);
        this.hitEnemy = false;
        this.sprite = sprite;
        this.sprites = [sprite];
        this.mover = new Mover(game, this);
        this.mover.setCollideWith({
            walls: false,
            ceiling: false,
            platforms: false,
        });
        this.mover.setVelocityX(speed); // A bullet only moves left or right
    }

    static spawn(game) {
        const x = game.player.x + (game.player.facingRight ? game.player.width - 15: 0);
        const y = game.player.y + game.player.width / 2 - SpriteLibrary.SIZES.BULLET.width / 2;
        const speed = game.player.facingRight ? Bullet.SPEED : -Bullet.SPEED;
        if (Bullet.SpawnReusePool.length > 0) {
            Bullet.SpawnReusePool.pop().reuse(x, y, speed);
        } else {
            game.bullets.push(new Bullet(game, x, y, SpriteLibrary.bullet(), speed));
        }
    }

    reuse(x, y, speed) {
        this.x = x;
        this.y = y;
        this.mover.setVelocityX(speed);
        this.hitEnemy = false;
        this.isOffScreen = false;
    }

    render(renderContext) {
        if (this.hitEnemy || this.isOffScreen) {
            return;
        }
        this.sprite.render(renderContext, this.x, this.y);
    }

    update() {
        super.update();
        if (this.hitEnemy || this.isOffScreen) {
            return;
        }

        this.mover.update();
        this.isOffScreen = this.x > this.game.width || this.x + this.width < 0;

        if (this.isOffScreen) {
            Bullet.SpawnReusePool.push(this);
            return;
        }

        // Check for shot enemies
        for (let enemy of this.game.enemies) {
            if (
                enemy.isShootable &&
                !enemy.isOffScreen &&
                !enemy.isDead &&
                this.intersects(enemy)
            ) {
                enemy.handleShot();
                this.hitEnemy = true;
                Bullet.SpawnReusePool.push(this);
                return; // A bullet can kill at most one enemy
            }
        }
    }
}
