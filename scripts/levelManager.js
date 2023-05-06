import { Boss } from './boss.js';
import { Level } from './level.js';
import { SpriteLibrary } from './spriteLibrary.js';

export class LevelManager {
    static LEVELS_PER_WORLD = 2; //20;
    static WORLD_COUNT = 2; //5;

    constructor(game) {
        this.game = game;
        this.levelNumber = 0;
        this.worldNumber = 1;

        this.worldBossFactories = new Map();
        for (let i=1; i<=LevelManager.WORLD_COUNT; i++) {
            this.worldBossFactories.set(i, () => Boss.spawn(game, i));
        }
    }

    getNextLevel() {
        if (this.worldNumber > LevelManager.WORLD_COUNT) {
            return null;
        }

        // Advance to the next level & world
        this.levelNumber++;
        if (this.levelNumber > LevelManager.LEVELS_PER_WORLD) {
            this.levelNumber = 1;
            this.worldNumber++;
            if (this.worldNumber > LevelManager.WORLD_COUNT) {
                return null; // Finished last level
            }
        }

        const world = {
            number: this.worldNumber,
            title: `World ${this.worldNumber}`,
            boss:
                this.levelNumber === LevelManager.LEVELS_PER_WORLD // Last level in world? ...
                    ? this.worldBossFactories.get(this.worldNumber)() // Boss level!
                    : null,
        };

        return new Level(
            this.game,
            this.levelNumber,
            world,
            `Level ${this.levelNumber}`,
            'TODO: probabilities',
            this.getPlatformSprite()
        );
    }

    getPlatformSprite() {
        switch (this.worldNumber) {
            case 1:
                return this.levelNumber % 2 === 0
                    ? SpriteLibrary.groundGreen()
                    : SpriteLibrary.groundPurple();
            case 2:
                return this.levelNumber % 2 === 0
                    ? SpriteLibrary.groundGreen()
                    : SpriteLibrary.groundPurple();
            case 3:
                return this.levelNumber % 2 === 0
                    ? SpriteLibrary.groundGreen()
                    : SpriteLibrary.groundPurple();
            case 4:
                return this.levelNumber % 2 === 0
                    ? SpriteLibrary.groundGreen()
                    : SpriteLibrary.groundPurple();
            case 5:
                return this.levelNumber % 2 === 0
                    ? SpriteLibrary.groundGreen()
                    : SpriteLibrary.groundPurple();
            default:
                throw new Error(`No platform sprite for world ${this.worldNumber}`);
        }
    }

    reset() {
        this.levelNumber = 0;
        this.worldNumber = 1;
    }
}
