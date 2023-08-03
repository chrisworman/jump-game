import { Collectable } from './collectable.js';
import { LaserGun } from './laserGun.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Platforms } from './platforms.js';
import { FilterManager } from './filterManager.js';
import { AudioManager } from './audioManager.js';
import { Mover } from './mover.js';
import { Velocity } from './velocity.js';

export class LaserCollectable extends Collectable {
    static SPAWN_WALL_PADDING = 80;
    static UNCOLLECTED_FLOAT_DISTANCE_X = 1.4;
    static UNCOLLECTED_FLOAT_DISTANCE_Y = 3.8;
    static UNCOLLECTED_VELOCITY_X = 0.07;
    static UNCOLLECTED_VELOCITY_Y = 0.1;

    constructor(game, x, y, sprite) {
        super(game, x, y, sprite);
        this.ogX = x;
        this.ogY = y;
        this.mover = new Mover(game, this);
        this.mover.setVelocity(
            new Velocity(
                LaserCollectable.UNCOLLECTED_VELOCITY_X,
                -LaserCollectable.UNCOLLECTED_VELOCITY_Y
            )
        );
    }

    onCollected() {
        this.game.audioManager.play(AudioManager.SOUNDS.LASER_COLLECTED);
        this.sprite.filterManager.animate(
            FilterManager.blurFadeOutAnimation(),
            this.game.gameTime,
            150
        );
        this.game.player.laserGun = new LaserGun(this.game);
    }

    update() {
        super.update();
        if (!this.collected) {
            this.sprite.filterManager.hueDegrees =
                ((Math.sin(0.003 * this.game.gameTime) + 1.0) / 2.0) * 90;
            this.mover.update();
            if (Math.abs(this.x - this.ogX) >= LaserCollectable.UNCOLLECTED_FLOAT_DISTANCE_X) {
                this.mover.setVelocityX(-this.mover.velocity.x);
            }
            if (Math.abs(this.y - this.ogY) >= LaserCollectable.UNCOLLECTED_FLOAT_DISTANCE_Y) {
                this.mover.setVelocityY(-this.mover.velocity.y);
            }
        }
    }

    render(renderContext) {
        if (this.collected) {
            if (this.sprite.filterManager.animation == null) {
                return;
            }
        }
        this.sprite.render(renderContext, this.x, this.y);
    }

    static spawn(game) {
        // Position the shield away from the player in the middle of the platform
        const x =
            game.player.x <= game.canvas.width * 0.5
                ? game.canvas.width -
                  SpriteLibrary.SIZES.SHIELD.width -
                  LaserCollectable.SPAWN_WALL_PADDING
                : LaserCollectable.SPAWN_WALL_PADDING;
        const y =
            game.canvas.height -
            Platforms.HEIGHT * 0.5 +
            Platforms.FLOOR_HEIGHT -
            SpriteLibrary.SIZES.LASER_COLLECTABLE.height * 0.5;
        return new LaserCollectable(game, x, y, SpriteLibrary.laserCollectable());
    }
}
