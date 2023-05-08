import { AudioManager } from './audioManager.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Box } from './box.js';
import { Entity } from './entity.js';
import { FilterManager } from './filterManager.js';

export class Collectable extends Entity {
    static SPAWN_BOTTOM_BUFFER = 100;

    constructor(game, x, y, sprite) {
        super(game, x, y, sprite.width, sprite.height);
        this.sprite = sprite;
        this.collected = false;
    }

    static spawn(game, entitiesToAvoid, probabilities) {
        let xy = null;
        let intersecting = null;
        let maxLoops = 100;
        let loops = 0;
        do {
            xy = RandomGenerator.randomXYIn(
                SpriteLibrary.SIZES.COLLECTABLE.width,
                SpriteLibrary.SIZES.COLLECTABLE.height,
                game.canvas.width,
                game.canvas.height - Collectable.SPAWN_BOTTOM_BUFFER
            );
            intersecting = entitiesToAvoid.filter((x) =>
                x.intersects(
                    new Box(
                        xy.x,
                        xy.y,
                        SpriteLibrary.SIZES.COLLECTABLE.width,
                        SpriteLibrary.SIZES.COLLECTABLE.height
                    )
                )
            );
            loops++;
        } while (intersecting.length > 0 && loops < maxLoops);

        // TODO: apply probabilities
        return new Collectable(game, xy.x, xy.y, SpriteLibrary.collectable());
    }

    update() {
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
