import { AudioManager } from './audioManager.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Entity } from './entity.js';
import { FilterManager } from './filterManager.js';

export class Collectable extends Entity {
    static SPAWN_BOTTOM_BUFFER = 100;

    constructor(game, x, y, sprite) {
        super(game, x, y, sprite.width, sprite.height);
        this.sprite = sprite;
        this.collected = false;
    }

    static spawn(game) {
        const xy = RandomGenerator.randomXYIn(
            SpriteLibrary.SIZES.COLLECTABLE.width,
            SpriteLibrary.SIZES.COLLECTABLE.height,
            game.canvas.width,
            game.canvas.height - Collectable.SPAWN_BOTTOM_BUFFER
        );
        return new Collectable(game, xy.x, xy.y, SpriteLibrary.collectable());
    }

    update() {
        super.update();
        if (!this.collected && this.intersects(this.game.player)) {
            this.collected = true;
            this.sprite.filterManager.animate(FilterManager.blurFadeOutAnimation(), 150);
            this.game.incrementCollectableCount();
            this.game.audioManager.play(AudioManager.AUDIO_FILES.COLLECTABLE_COLLECTED);
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
}
