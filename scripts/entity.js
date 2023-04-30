import { Box } from './box.js';

export class Entity extends Box {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.isOffScreen = false;
    }
}
