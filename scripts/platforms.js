import { Game } from './game.js';
import { GameState } from './gameState.js';

export class Platforms {
    static HEIGHT = 100;
    static COUNT = 8;
    static _PlatformYs = null;

    constructor(game) {
        this.game = game;
        this.lastGameState = this.game.state;
        this.currentSprite = null;
        this.nextSprite = null;
        this.levelTransitionScrollY = 0;
    }

    update() {
        if (this.game.state === GameState.LEVEL_TRANSITION) {
            this.levelTransitionScrollY += Game.LEVEL_SCROLL_SPEED;
        }
    }

    render(renderContext) {
        const totalHeight = Platforms.COUNT * Platforms.HEIGHT;
        switch (this.game.state) {
            case GameState.PLAYING:
            case GameState.GAME_OVER:
            case GameState.GAME_BEAT:
                for (let y = 0; y < totalHeight; y += Platforms.HEIGHT) {
                    this.currentSprite.render(renderContext, 0, y);
                }
                break;
            case GameState.LEVEL_TRANSITION:
                for (let y = 0; y < totalHeight; y += Platforms.HEIGHT) {
                    this.nextSprite.render(
                        renderContext,
                        0,
                        y + this.levelTransitionScrollY - totalHeight
                    );
                }
                for (let y = 0; y < totalHeight; y += Platforms.HEIGHT) {
                    this.currentSprite.render(renderContext, 0, y + this.levelTransitionScrollY);
                }
                break;
        }
    }

    handleLevelComplete(nextSprite) {
        this.levelTransitionScrollY = 0;
        this.nextSprite = nextSprite;
    }

    static getPlatformYs() {
        if (!Platforms._PlatformYs) {
            Platforms._PlatformYs = [];
            for (let i = 1; i < Platforms.COUNT; i++) {
                Platforms._PlatformYs.push(i * Platforms.HEIGHT);
            }
        }
        
        return Platforms._PlatformYs;
    }
}
