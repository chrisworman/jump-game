import { Game } from "./game.js";
import { GameState } from "./gameState.js";

export class Platforms {
    static HEIGHT = 100;
    static COUNT = 8;

    constructor(game) {
        this.game = game;
        this.lastGameState = this.game.state;
        this.currentSprite = this.game.level.platformSprite;
        this.nextSprite = null;
        this.y = 0;
    }

    update() {
        if (this.game.state !== this.lastGameState) { // transitioning game state
            if (this.game.state === GameState.LEVEL_TRANSITION) {
                this.y = 0;
            }
        }

        if (this.game.state === GameState.LEVEL_TRANSITION) {
            this.y += Game.LEVEL_SCROLL_SPEED;
        }

        this.lastGameState = this.game.state;
    }

    static getPlatformYs() {
        let result = [];
        for (let i=1; i<Platforms.COUNT; i++) {
            result.push(i * Platforms.HEIGHT);
        }
        return result;
    }

    render(renderContext) {
        const totalHeight = Platforms.COUNT * Platforms.HEIGHT;
        switch (this.game.state) {
            case GameState.PLAYING:
            case GameState.GAME_OVER:
            case GameState.GAME_BEAT:
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
