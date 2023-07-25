import { Entity } from './entity.js';

export class Collectable extends Entity {
    constructor(game, x, y, sprite) {
        super(game, x, y, sprite.width, sprite.height);
        this.sprite = sprite;
        this.collected = false;
    }

    update() {
        super.update();
        if (!this.collected && this.intersects(this.game.player)) {
            this.collected = true;
            this.onCollected();
        }
    }

    render(renderContext) {
        this.sprite.render(renderContext, this.x, this.y);
    }

    onCollected() {
        throw new Error('Not implemented');
    }
}
