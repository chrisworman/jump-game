import { AudioManager } from './audioManager.js';
import { Entity } from './entity.js';
import { GameState } from './gameState.js';
import { SpriteLibrary } from './spriteLibrary.js';

export class LaserGun extends Entity {
    static XOFFSET = 4;
    static YOFFSET = 0;

    constructor(game) {
        super(
            game,
            0,
            0,
            SpriteLibrary.SIZES.LASER_BEAM.width,
            SpriteLibrary.SIZES.LASER_BEAM.height
        );
        this.sprite = SpriteLibrary.laserBeam();
        this.isOn = false;
        this.soundHandler = null;
    }

    update() {
        if (this.game.userControls.shoot) {

            // Position the beam relative to player
            const player = this.game.player;
            this.x = player.facingRight
                ? player.x + player.width - LaserGun.XOFFSET
                : player.x - this.width + LaserGun.XOFFSET;
            this.y = player.y + LaserGun.YOFFSET + player.height * 0.5;

            // Shoot enemies
            for (let enemy of this.game.enemies) {
                if (!enemy.isDead && !enemy.isOffScreen && this.intersects(enemy)) {
                    enemy.handleShot();
                }
            }

            // Start the audio if necessary
            if (!this.isOn) {
                this.soundHandler = this.game.audioManager.play(AudioManager.SOUNDS.LASER_GUN);
            }

            this.sprite.filterManager.hueDegrees = (Math.sin(0.006 * this.game.gameTime) + 1.0) / 2.0 * 180;
            this.sprite.filterManager.blurPixels = (Math.sin(0.001 * this.game.gameTime) + 1.0) / 2.0;
            
            this.isOn = true;

        } else if (this.isOn) {
            this.off();
        }
    }

    off() {
        if (this.soundHandler) {
            this.soundHandler.stop();
        }
        this.isOn = false;
    }

    render(renderContext) {
        if (this.isOn && this.game.state === GameState.PLAYING) {
            this.sprite.render(renderContext, this.x, this.y);
        }
    }
}
