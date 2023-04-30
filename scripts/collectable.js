import { AudioManager } from './audioManager.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Box } from "./box.js";
import { Entity } from './entity.js';

export class Collectable extends Entity {
    static SPAWN_BOTTOM_BUFFER = 100;

    constructor(game, x, y, sprite, points) {
        super(x, y, sprite.width, sprite.height);
        this.game = game;
        this.sprite = sprite;
        this.points = points;
        this.collected = false;
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
            intersecting = entitiesToAvoid.filter((x) => x.intersects(new Box(xy.x, xy.y, 50, 50)));
            loops++;
        } while (intersecting.length > 0 && loops < maxLoops);

        // TODO: apply probabilities
        return new Collectable(game, xy.x, xy.y, SpriteLibrary.collectable(), 50);
    }

    update() {
        if (!this.collected && this.intersects(this.game.player)) {
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
