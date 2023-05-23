import { Game } from './game.js';
import { GameState } from './gameState.js';

export class Platforms {
    static HEIGHT = 100;
    static COUNT = 8;
    static _PlatformYs = null;

    constructor(game) {
        this.game = game;
        this.lastGameState = this.game.state;
        this.currentSprites = [];
        this.nextSprites = [];
        this.levelTransitionScrollY = 0;
    }

    update() {
        if (this.game.state === GameState.LEVEL_TRANSITION) {
            this.levelTransitionScrollY += Game.LEVEL_SCROLL_SPEED;
        }
    }

    render(renderContext) {
        const totalHeight = Platforms.COUNT * Platforms.HEIGHT;
        let spriteIndex = 0;
        switch (this.game.state) {
            case GameState.PLAYING:
            case GameState.GAME_OVER:
            case GameState.GAME_BEAT:
                spriteIndex = 0;
                for (let y = 0; y < totalHeight; y += Platforms.HEIGHT, spriteIndex++) {
                    this.currentSprites[spriteIndex % this.currentSprites.length].render(renderContext, 0, y);
                }
                break;
            case GameState.LEVEL_TRANSITION:
                spriteIndex = 0;
                for (let y = 0; y < totalHeight; y += Platforms.HEIGHT, spriteIndex++) {
                    this.nextSprites[spriteIndex % this.nextSprites.length].render(
                        renderContext,
                        0,
                        y + this.levelTransitionScrollY - totalHeight
                    );
                }
                spriteIndex = 0;
                for (let y = 0; y < totalHeight; y += Platforms.HEIGHT, spriteIndex++) {
                    this.currentSprites[spriteIndex % this.currentSprites.length].render(
                        renderContext,
                        0,
                        y + this.levelTransitionScrollY
                    );
                }
                break;
        }
    }

    handleLevelComplete(nextSprites) {
        this.levelTransitionScrollY = 0;
        this.nextSprites = nextSprites;
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