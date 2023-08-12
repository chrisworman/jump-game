import { AudioManager } from './audioManager.js';
import { Entity } from './entity.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Mover } from './mover.js';
import { FilterManager } from './filterManager.js';

export class HealthUpHeart extends Entity {
    static FLOAT_UP_SPEED = -1.5;

    constructor(game, x, y, width, height) {
        super(game, x, y, width, height);

        // Fade out
        this.sprite = SpriteLibrary.healthUpHeart();
        this.sprite.filterManager.animate(FilterManager.fadeOutAnimation(), game.gameTime, 1500);

        // Float up
        this.mover = new Mover(game, this);
        this.mover.setCollideWith({
            platforms: false,
            ceiling: false,
            walls: false,
        });
        this.mover.setVelocityY(HealthUpHeart.FLOAT_UP_SPEED + game.player.mover.velocity.y * 0.25);
        this.mover.setVelocityX(game.player.mover.velocity.x * 0.25)
    }

    update() {
        super.update();
        this.mover.update();
        if (this.sprite.filterManager.animation == null) {
            // Done fading out
            this.game.overlayEntities = this.game.overlayEntities.filter((x) => x !== this);
            return;
        }
    }

    render(renderContext) {
        this.sprite.render(renderContext, this.x, this.y);
    }

    static spawn(game) {
        game.audioManager.play(AudioManager.SOUNDS.HEALTH_UP);
        game.overlayEntities.push(
            new HealthUpHeart(
                game,
                game.player.x + game.player.mover.velocity.x + game.player.width * 0.5,
                game.player.y + game.player.mover.velocity.y,
                SpriteLibrary.SIZES.HEALTH_UP_HEART.width,
                SpriteLibrary.SIZES.HEALTH_UP_HEART.height
            )
        );
    }
}
