import { SpriteLibrary } from './spriteLibrary.js';
import { GameState } from './gameState.js';
import { Game } from './game.js';
import { FilterManager } from './filterManager.js';

export class Background {
    constructor(game, fadeIn = false) {
        this.game = game;
        this.movementFactor = 60 / Game.FPS; // TODO: extract to game
        this.offset = 0;

        const worldNumber = game.level?.world?.number || 1;
        this.layers = [
            {
                sprite: SpriteLibrary[`world${worldNumber}BackgroundLayer0`](),
                offset: 0,
                speed: 1,
            },
            {
                sprite: SpriteLibrary[`world${worldNumber}BackgroundLayer1`](),
                offset: 0,
                speed: 2,
            },
            {
                sprite: SpriteLibrary[`world${worldNumber}BackgroundLayer2`](),
                offset: 0,
                speed: 4,
            },
        ];

        if (fadeIn) {
            this.layers.forEach((x) => {
                x.sprite.filterManager.animate(
                    FilterManager.fadeInBrightnessAnimation(),
                    game.gameTime,
                    1500
                );
            });
        }
    }

    update() {
        if (this.game.state === GameState.LEVEL_TRANSITION) {
            for (const layer of this.layers) {
                layer.offset =
                    (layer.offset + layer.speed * this.movementFactor) % this.game.canvas.height;
            }
        }
    }

    render(renderContext) {
        for (const layer of this.layers) {
            layer.sprite.render(renderContext, 0, layer.offset);
            layer.sprite.render(renderContext, 0, layer.offset - this.game.canvas.height);
        }
    }

    fadeOut() {
        this.layers.forEach((x) => {
            x.sprite.filterManager.animate(
                FilterManager.fadeOutBrightnessAnimation(),
                this.game.gameTime,
                1500
            );
        });
    }
}
