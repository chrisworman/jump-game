import { AudioManager } from './audioManager.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Collider } from './collider.js';

export class Collectable {
    static SPAWN_BOTTOM_BUFFER = 100;

    constructor(game, x, y, sprite, points) {
        this.game = game;
        this.points = points;
        this.collected = false;

        this.x = x;
        this.y = y;

        this.sprite = sprite;
        this.width = sprite.width;
        this.height = sprite.height;
    }

    static spawn(game, entitiesToAvoid, probabilities) {
        let xy = null;
        let intersecting = null;
        let maxLoops = 100;
        let loops = 0;
        do {
            xy = RandomGenerator.randomXYIn(
                50,
                50,
                game.canvas.width,
                game.canvas.height - Collectable.SPAWN_BOTTOM_BUFFER
            );
            intersecting = Collider.filterIntersecting(
                {
                    x: xy.x,
                    y: xy.y,
                    width: 50,
                    height: 50,
                },
                entitiesToAvoid
            );
            loops++;
        } while (intersecting.length > 0 && loops < maxLoops);

        // TODO: apply probabilities
        return new Collectable(game, xy.x, xy.y, SpriteLibrary.collectable(), 50);
    }

    update() {
        if (!this.collected && Collider.intersects(this.game.player, this)) {
            this.collected = true;
            this.game.incrementScore(this.points);
            this.game.audioManager.play(AudioManager.AUDIO_FILES.COLLECTABLE_COLLECTED);
        }
    }

    render(renderContext) {
        if (this.collected) {
            return;
        }
        this.sprite.render(renderContext, this.x, this.y);
    }
}
