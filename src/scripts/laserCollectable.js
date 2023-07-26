import { Collectable } from './collectable.js';
import { LaserGun } from './laserGun.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Platforms } from './platforms.js';
import { FilterManager } from './filterManager.js';
import { AudioManager } from './audioManager.js';

export class LaserCollectable extends Collectable {
    static SPAWN_WALL_PADDING = 50;

    onCollected() {
        this.game.audioManager.play(AudioManager.AUDIO_FILES.LASER_COLLECTED);
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
            this.sprite.filterManager.hueDegrees = (Math.sin(0.001 * this.game.gameTime) + 1.0) / 2.0 * 360;
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
            SpriteLibrary.SIZES.LASER_COLLECTABLE.height * 0.5 -
            Platforms.HEIGHT * 0.5 +
            Platforms.FLOOR_HEIGHT;
        return new LaserCollectable(game, x, y, SpriteLibrary.laserCollectable());
    }
}
