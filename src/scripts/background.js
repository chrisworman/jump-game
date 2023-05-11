import { SpriteLibrary } from "./spriteLibrary.js";
import { GameState } from "./gameState.js";

export class Background {
    constructor(game) {
        this.game = game;
        this.offset = 0;
        this.layers = [
            {
                sprite: SpriteLibrary.backgroundLayer0(),
                offset: 0,
                speed: 1,
            },
            {
                sprite: SpriteLibrary.backgroundLayer1(),
                offset: 0,
                speed: 2,
            },
            {
                sprite: SpriteLibrary.backgroundLayer2(),
                offset: 0,
                speed: 4,
            },
        ]; 
    }

    update() {
        if (this.game.state === GameState.LEVEL_TRANSITION) {
            for (const layer of this.layers) {
                layer.offset = (layer.offset + layer.speed) % this.game.canvas.height;
            }
        }
    }

    render(renderContext) {
        for (const layer of this.layers) {
            layer.sprite.render(renderContext, 0, layer.offset);
            layer.sprite.render(renderContext, 0, layer.offset - this.game.canvas.height);
        }
    }
}
