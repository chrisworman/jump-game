import { Game } from "./game.js";
import { GameState } from "./gameState.js";
import { Sprite } from "./sprite.js";

export class Platforms {
    static HEIGHT = 100;
    static COUNT = 8;

    constructor(gameState, currentSprite) {
        this.currentSprite = currentSprite;
        this.nextSprite = null;
        this.gameState = gameState;
        this.y = 0;
    }

    update(gameState) {
        if (gameState !== this.gameState) { // transitioning game state
            if (gameState === GameState.LEVEL_TRANSITION) {
                this.y = 0;
            }
        }

        if (gameState === GameState.LEVEL_TRANSITION) {
            this.y += Game.LEVEL_SCROLL_SPEED;
        }

        this.gameState = gameState;
    }

    render(renderContext) {
        const totalHeight = Platforms.COUNT * Platforms.HEIGHT;
        switch (this.gameState) {
            case GameState.PLAYING:
            case GameState.GAME_OVER:
                for (let y=0; y < totalHeight; y += Platforms.HEIGHT) {
                    this.currentSprite.render(renderContext, 0, y);
                }
                break;
            case GameState.LEVEL_TRANSITION:
                for (let y=0; y < totalHeight; y += Platforms.HEIGHT) {
                    this.nextSprite.render(renderContext, 0, y + this.y - totalHeight);
                }
                for (let y=0; y < totalHeight; y += Platforms.HEIGHT) {
                    this.currentSprite.render(renderContext, 0, y + this.y);
                }
                break;
        }
        
    }
}
