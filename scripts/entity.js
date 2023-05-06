import { Box } from './box.js';

export class Entity extends Box {
    constructor(game, x, y, width, height) {
        super(x, y, width, height);
        this.game = game;
        this.isOffScreen = false;
    }

    onFloor() {
        return this.y + this.height === this.game.canvas.height;
    }
}
