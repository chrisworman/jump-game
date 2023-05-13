import { Platforms } from './platforms.js';
import { GameState } from './gameState.js';
import { Player } from './player.js';
import { RenderContext } from './renderContext.js';
import { UserControls } from './userControls.js';
import { LevelManager } from './levelManager.js';
import { FilterManager } from './filterManager.js';
import { AudioManager } from './audioManager.js';
import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Hud } from './hud.js';
import { Bullet } from './bullet.js';
import { Bomb } from './bomb.js';
import { Background } from './background.js';

export class Game {
    static GRAVITY = 0.3;
    static LEVEL_SCROLL_SPEED = 8;
    static MAX_PLAYER_HEALTH = 3;
    static FPS = 60;
    static TIME_STEP = 1000 / Game.FPS;

    constructor() {
        this.state = GameState.INITIALIZING;

        // Prioritize loading assets
        SpriteLibrary.preloadImages();
        this.audioManager = new AudioManager();

        this.canvas = document.getElementById('canvas');
        this.middleContent = document.getElementById('middleContent');
        this.hud = new Hud(this);
        this.userControls = new UserControls(this);
        this.player = new Player(this);
        this.levelManager = new LevelManager(this);
        this.renderContext = new RenderContext(this.canvas);
        this.filterManager = new FilterManager();
        this.background = new Background(this);
        this.platforms = new Platforms(this);
        this.bullets = [];
        this.collectables = [];
        this.enemies = [];

        this.setCollectableCount(0);
        this.hud.textOverlayFadeIn('Blobby the Jumper');
        this.hud.showStartButton();
        this.gameLoop();
    }

    startNewGame() {
        // Update state before UI
        this.levelManager.reset();
        this.level = this.levelManager.getNextLevel();
        this.player.reset();
        this.setCollectableCount(0);
        this.bullets = [];
        Bullet.SpawnReusePool = [];
        this.collectables = [];
        this.enemies = [];
        Bomb.SpawnReusePool = [];
        this.platforms.currentSprites = this.level.platformSprites;
        this.collectables = this.level.spawnCollectables();
        this.enemies = this.level.spawnInitialEnemies();

        // Update UI
        this.hud.textOverlayFadeOut(`${this.level.world.title} - ${this.level.title}`);
        this.filterManager.animate((fm, amountDone) => {
            fm.blurPixels = 10 - 10 * amountDone;
            fm.brightnessPercent = 100 * amountDone;
        }, 1000);
        this.hud.hideStartButton();
        this.hud.hideRestartButton();

        this.audioManager.play(AudioManager.AUDIO_FILES.BACKGROUND_SONG, true);
        this.lastUpdateTime = performance.now();
        this.state = GameState.PLAYING;
    }

    gameLoop() {
        const currentTime = performance.now();
        let elapsedTime = currentTime - this.lastUpdateTime;

        while (elapsedTime > Game.TIME_STEP) {
            this.update();
            elapsedTime -= Game.TIME_STEP;
            this.lastUpdateTime += Game.TIME_STEP;
        }

        this.render();
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update() {
        switch (this.state) {
            case GameState.PLAYING:
                this.updatePlaying();
                break;
            case GameState.LEVEL_TRANSITION:
                this.updateLevelTransition();
                break;
        }
    }

    updatePlaying() {
        // Updating just the player first, which can die or complete the level
        this.player.update();

        // Player dead?
        if (this.player.health === 0) {
            this.handlePlayerDead();
            return;
        }

        // Level complete?
        if (this.level.isComplete()) {
            this.handleLevelComplete();
            return;
        }

        // Update remaining entities
        this.platforms.update();
        this.enemies.forEach((enemy) => enemy.update());
        this.bullets.forEach((bullet) => bullet.update());
        this.collectables.forEach((x) => x.update());
        this.level.spawnEnemies();
    }

    updateLevelTransition() {
        this.player.update();
        this.background.update();
        this.platforms.update();
        this.enemies.forEach((enemy) => enemy.update());
        this.bullets.forEach((bullet) => bullet.update());
        this.collectables.forEach((x) => x.update());

        // Has the player reached the bottom of the screen?
        if (this.player.y + this.player.height >= this.canvas.height) {
            // We are done transitioning
            this.collectables = [];
            this.enemies = [];
            Bomb.SpawnReusePool = [];
            this.bullets = [];
            Bullet.SpawnReusePool = [];
            this.hud.textOverlayFadeOut();
            this.platforms.currentSprites = this.level.platformSprites;
            this.player.handleLevelTransitionDone();
            this.enemies = this.level.spawnInitialEnemies();
            this.collectables = this.level.spawnCollectables();
            this.state = GameState.PLAYING;
        }
    }

    incrementCollectableCount() {
        this.setCollectableCount(this.collectableCount + 1);
    }

    setCollectableCount(count) {
        let finalCount = count;
        if (count >= 100) {
            if (this.player.health < Player.MAX_HEALTH) {
                this.player.setHealth(this.player.health + 1);
            }
            finalCount = 0;
        }
        this.collectableCount = finalCount;
        this.hud.displayCollectableCount(finalCount);
    }

    handlePlayerDead() {
        this.hud.textOverlayFadeIn('Game Over');
        this.hud.showRestartButton();
        this.filterManager.animate((fm, amountDone) => {
            fm.blurPixels = amountDone * 8;
            fm.brightnessPercent = 100 - 50 * amountDone;
        }, 1000);
        this.state = GameState.GAME_OVER;
    }

    handleLevelComplete() {
        this.level = this.levelManager.getNextLevel();

        if (!this.level) {
            // Beat the game!
            this.hud.textOverlayFadeIn('You Beat the Game!');
            this.hud.showRestartButton();
            this.filterManager.animate((fm, amountDone) => {
                fm.blurPixels = amountDone * 8;
                fm.brightnessPercent = 100 - 50 * amountDone;
            }, 1000);
            this.state = GameState.GAME_BEAT;
            return;
        }

        // Transition to next level
        this.hud.displayLevel(this.level);
        // this.hud.textOverlayFadeIn(`${this.level.world.title} - ${this.level.title}`);
        this.platforms.handleLevelComplete(this.level.platformSprites);
        this.player.handelLevelComplete();
        this.enemies.forEach((enemy) => {
            if (enemy.type === EnemyTypes.BOMB) {
                enemy.sprite.filterManager.animate(FilterManager.blurFadeOutAnimation(), 1000);
            }
        });
        this.state = GameState.LEVEL_TRANSITION;
    }

    toggleAudioMute() {
        if (this.audioManager) {
            if (this.audioManager.isMuted) {
                this.audioManager.unmute();
            } else {
                this.audioManager.mute();
            }
            this.hud.displayAudioMuted(this.audioManager.isMuted);
        }
    }

    shake() {
        if (this.middleContent.classList.contains('shake')) {
            this.middleContent.classList.remove('shake');
            this.middleContent.offsetWidth; // Force DOM reflow
        }
        this.middleContent.classList.add('shake');
    }

    isBossLevel() {
        return this.level && !!this.level.world.boss;
    }

    render() {
        const ctx = this.renderContext.getCanvasContext();
        this.filterManager.applyFilters(ctx, () => {
            this.background.render(this.renderContext);
            // this.platforms.render(this.renderContext);
            this.enemies
                .filter(
                    (x) =>
                        x.type === EnemyTypes.WALKER ||
                        x.type === EnemyTypes.TURRET ||
                        x.type === EnemyTypes.BOSS
                )
                .forEach((x) => x.render(this.renderContext));
            this.player.render(this.renderContext);
            this.bullets.forEach((x) => x.render(this.renderContext));
            this.collectables.forEach((x) => x.render(this.renderContext));
            this.platforms.render(this.renderContext); // temp
            this.enemies
                .filter((x) => x.type === EnemyTypes.BOMB)
                .forEach((x) => x.render(this.renderContext));
            this.enemies
                .filter((x) => x.type === EnemyTypes.FIRE_BALL)
                .forEach((x) => x.render(this.renderContext));
        });
    }
}

new Game();
