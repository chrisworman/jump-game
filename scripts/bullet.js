import { SpriteLibrary } from './spriteLibrary.js';
import { Mover } from './mover.js';
import { Entity } from './entity.js';

export class Bullet extends Entity {
    static SPEED = 8;

    constructor(game, x, y, sprite, speed) {
        super(game, x, y, SpriteLibrary.SIZES.BULLET.width, SpriteLibrary.SIZES.BULLET.height);
        this.hitEnemy = false;
        this.sprite = sprite;
        this.mover = new Mover(game, this, false);
        this.mover.setVelocityX(speed); // A bullet only moves left or right
    }

    static spawn(game) {
        return new Bullet(
            game,
            game.player.x + (game.player.facingRight ? game.player.width - 15 : 15),
            game.player.y + game.player.width / 2 - SpriteLibrary.SIZES.BULLET.width / 2,
            SpriteLibrary.bullet(),
            game.player.facingRight ? Bullet.SPEED : -Bullet.SPEED
        );
    }

    render(renderContext) {
        if (this.hitEnemy) {
            return;
        }
        this.sprite.render(renderContext, this.x, this.y);
    }

    update() {
        if (this.hitEnemy) {
            return;
        }

        this.mover.update();
        this.isOffScreen = this.x > this.game.width || this.x + this.width < 0;

        // Check for shot enemies
        for (let enemy of this.game.enemies) {
            if (enemy.isShootable && !enemy.isDead && this.intersects(enemy)) {
                enemy.handleShot();
                this.hitEnemy = true;
            }
        }
    }
}
