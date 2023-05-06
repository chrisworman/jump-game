import { Box } from './box.js';

export class Entity extends Box {
    constructor(game, x, y, width, height) {
        super(x, y, width, height);
        this.game = game;
        this.isOffScreen = false;
    }
}
