import { AudioManager } from './audioManager.js';
import { Level } from './level.js';
import { RandomGenerator } from './randomGenerator.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { World } from './world.js';

export class LevelManager {
    static LEVELS_PER_WORLD = 11;
    static WORLD_COUNT = 5;

    constructor(game) {
        this.game = game;
        this.levelNumber = 0;
        this.worldNumber = 1;
        this.world = new World(
            game,
            this.worldNumber,
            AudioManager.SOUNDS.BACKGROUND_SONG,
            AudioManager.SOUNDS.BOSS_SONG,
            AudioManager.SOUNDS.BOSS_CELEBRATION_SONG
        );
    }

    getNextLevel() {
        if (this.worldNumber > LevelManager.WORLD_COUNT) {
            return null;
        }

        // Advance to the next level & possibly world
        this.levelNumber++;
        if (this.levelNumber > LevelManager.LEVELS_PER_WORLD) {
            this.levelNumber = 1;
            this.worldNumber++;
            if (this.worldNumber > LevelManager.WORLD_COUNT) {
                return null; // Finished last level
            }
            this.world = new World(
                this.game,
                this.worldNumber,
                AudioManager.SOUNDS.BACKGROUND_SONG,
                AudioManager.SOUNDS.BOSS_SONG,
                AudioManager.SOUNDS.BOSS_CELEBRATION_SONG
            );
        }

        return new Level(
            this.game,
            this.levelNumber,
            this.world,
            `Level ${this.levelNumber}`,
            RandomGenerator.randomizeArray(this.getPlatformSprites())
        );
    }

    getPlatformSprites() {
        return [
            SpriteLibrary.platform1(),
            SpriteLibrary.platform2(),
            SpriteLibrary.platform3(),
            SpriteLibrary.platform4(),
            SpriteLibrary.platform5(),
            SpriteLibrary.platform6(),
            SpriteLibrary.platform7(),
        ];
    }

    reset() {
        const query = new URLSearchParams(window.location.search);
        this.levelNumber = query.get('level') ? parseInt(query.get('level')) - 1 : 0;
        this.worldNumber =  query.get('world') ? parseInt(query.get('world')) : 1;
        this.world = new World(
            this.game,
            this.worldNumber,
            AudioManager.SOUNDS.BACKGROUND_SONG,
            AudioManager.SOUNDS.BOSS_SONG,
            AudioManager.SOUNDS.BOSS_CELEBRATION_SONG
        );
    }
}
