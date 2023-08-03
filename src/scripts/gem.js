import { AudioManager } from './audioManager.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { FilterManager } from './filterManager.js';
import { Collectable } from './collectable.js';

export class Gem extends Collectable {
    static SPAWN_BOTTOM_BUFFER = 100;

    static spawn(game) {
        const xy = RandomGenerator.randomXYIn(
            SpriteLibrary.SIZES.GEM.width,
            SpriteLibrary.SIZES.GEM.height,
            game.canvas.width,
            game.canvas.height - Gem.SPAWN_BOTTOM_BUFFER
        );
        return new Gem(game, xy.x, xy.y, SpriteLibrary.gem());
    }

    onCollected() {
        this.sprite.filterManager.animate(FilterManager.blurFadeOutAnimation(), this.game.gameTime, 150);
        this.game.incrementGemCount();
        this.game.audioManager.play(AudioManager.SOUNDS.GEM_COLLECTED);
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
