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
import { Rocket } from './rocket.js';
import { HealthUpHeart } from './healthUpHeart.js';
import { Enemy } from './enemy.js';
import { Modal } from './modal.js';
import { Stats } from './stats.js';
import { LeaderBoard } from './leaderBoard.js';

export class Game {
    static LEVEL_SCROLL_SPEED = 6.5;
    static MAX_PLAYER_HEALTH = 3;
    static FPS = 60;
    static TIME_STEP = 1000 / Game.FPS;
    static GEM_HEALTH_UP_THRESHOLD = 50;
    static WORLD_WIDTH = 550;
    static WORLD_HEIGHT = 800;
    static HUD_HEIGHT = 50;
    static ON_SCREEN_CONTROLS_HEIGHT = 100;

    constructor() {
        this.isPaused = false;
        this.gameTime = 0;
        this.state = GameState.INITIALIZING;

        // Prioritize loading assets
        SpriteLibrary.preloadImages();
        this.audioManager = new AudioManager();

        this.hudContainer = document.getElementById('hud');
        this.responsiveCanvas = document.getElementById('responsiveCanvas');
        this.onScreenControls = document.getElementById('onScreenControls');
        this.modal = new Modal(this);

        this.handleWindowResize();
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        document.addEventListener('keypress', (event) => {
            if (event.key === 'p') {
                if (this.isPaused) {
                    this.resume();
                } else {
                    this.pause();
                }
            }
        });

        this.canvas = document.createElement('canvas');
        this.canvas.width = Game.WORLD_WIDTH;
        this.canvas.height = Game.WORLD_HEIGHT;

        this.hud = new Hud(this);
        this.userControls = new UserControls(this);
        this.player = new Player(this);
        this.levelManager = new LevelManager(this);
        this.renderContext = new RenderContext(this);
        this.filterManager = new FilterManager();
        this.background = new Background(this);
        this.platforms = new Platforms(this);
        this.bullets = [];
        this.collectables = [];
        this.overlayEntities = [];
        this.enemies = [];
        this.enemyDeathsByType = {};

        this.setGemCount(0);
        document.body.style.display = '';
        this.modal.showManual('Pixel Jump', 'Start', () => {
            this.startNewGame();
        });
        this.gameLoop();
    }

    startNewGame() {
        // Update state before UI
        this.stats = new Stats(this);
        this.gameTime = 0;
        this.lastUpdateTime = null;
        this.levelManager.reset();
        this.level = this.levelManager.getNextLevel();
        this.background = new Background(this, true);
        // TODO: this is a hack to handle restarting from beating the game
        if (this.soundHandler) {
            this.soundHandler.stop();
            this.soundHandler = null;
        }
        this.level.world.playSong();
        this.hud.displayLevel(this.level);
        this.hud.displayPoints(0);
        this.player.reset();
        this.setGemCount(0);
        this.bullets = [];
        Bullet.SpawnReusePool = [];
        this.collectables = [];
        this.enemies = [];
        Bomb.SpawnReusePool = [];
        Rocket.SpawnReusePool = [];
        this.platforms.currentSprites = this.level.platformSprites;
        this.enemies = this.level.spawnInitialEnemies();
        this.collectables = this.level.spawnCollectables();

        // Update UI
        this.filterManager.animate(
            (fm, amountDone) => {
                fm.blurPixels = 10 - 10 * amountDone;
                fm.brightnessPercent = 100 * amountDone;
            },
            this.gameTime,
            1000
        );

        this.state = GameState.PLAYING;
    }

    gameLoop() {
        if (!this.isPaused) {
            if (this.lastUpdateTime === null) {
                this.lastUpdateTime = performance.now();
            }
            const currentTime = performance.now();
            let elapsedTime = currentTime - this.lastUpdateTime;

            while (elapsedTime > Game.TIME_STEP) {
                this.update();
                elapsedTime -= Game.TIME_STEP;
                this.gameTime += Game.TIME_STEP;
                this.lastUpdateTime += Game.TIME_STEP;
            }
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
            case GameState.BOSS_CELEBRATION:
                this.updateBossCelebration();
                break;
            case GameState.WORLD_OUTRO:
                this.updateWorldOutro();
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
        this.bullets.forEach((bullet) => bullet.update()); // Consider updating bullets first to kill enemies?
        this.collectables.forEach((x) => x.update());
        this.overlayEntities.forEach((x) => x.update());
        this.level.spawnEnemies();
    }

    updateLevelTransition() {
        this.player.update();
        this.background.update();
        this.platforms.update();
        this.enemies.forEach((enemy) => enemy.update());
        this.bullets.forEach((bullet) => bullet.update());
        this.collectables.forEach((x) => x.update());
        this.overlayEntities.forEach((x) => x.update());

        // Has the player reached the bottom of the screen?
        if (this.player.y + this.player.height >= this.canvas.height) {
            // We are done transitioning
            this.collectables = [];
            this.enemies = [];
            this.bullets = [];
            Bomb.SpawnReusePool = [];
            Bullet.SpawnReusePool = [];
            Rocket.SpawnReusePool = [];
            this.platforms.currentSprites = this.level.platformSprites;
            this.player.handleLevelTransitionDone();
            this.enemies = this.level.spawnInitialEnemies();
            this.collectables = this.level.spawnCollectables();
            this.state = GameState.PLAYING;
        }
    }

    updateBossCelebration() {
        this.player.update();
        this.overlayEntities.forEach((x) => x.update());
    }

    updateWorldOutro() {
        this.player.update();
    }

    incrementGemCount() {
        this.stats.gemCollected();
        this.setGemCount(this.gemCount + 1);
    }

    setGemCount(count) {
        let finalCount = count;
        if (count >= Game.GEM_HEALTH_UP_THRESHOLD) {
            if (this.player.health < Player.MAX_HEALTH) {
                HealthUpHeart.spawn(this);
                this.player.setHealth(this.player.health + 1);
            }
            finalCount = 0;
        }
        this.gemCount = finalCount;
        this.hud.displayGemCount(finalCount);
    }

    handlePlayerDead() {
        // Stop audio
        this.level.world.stopSong();
        if (this.player.laserGun) {
            this.player.laserGun.off();
        }

        // TODO: play game over song
        // this.soundHandler = this.audioManager.play(AudioManager.SOUNDS.GAME_OVER);

        this.filterManager.animate(
            (fm, amountDone) => {
                fm.blurPixels = amountDone * 2;
                fm.brightnessPercent = 100 - 50 * amountDone;
            },
            this.gameTime,
            2000
        );

        const finalPoints = this.stats.points;
        if (LeaderBoard.isNewRecord(finalPoints)) {
            this.modal.showNewLeaderBoardRecord(finalPoints);
        } else {
            this.modal.showTabs('Game Over', 'Play Again', () => {
                this.startNewGame();
            });
        }

        this.state = GameState.GAME_OVER;
    }

    handleLevelComplete() {
        if (this.player.laserGun) {
            this.player.laserGun.off();
        }

        // Fade certain entities: all bombs and rockets, and all enemies if boss level
        this.enemies.forEach((x) => {
            if (
                !x.isDead &&
                (this.isBossLevel() || x.type === EnemyTypes.BOMB || x.type === EnemyTypes.ROCKET)
            ) {
                x.isDead = true;
                x.isShootable = false;
                const deathAnimation = FilterManager.blurFadeOutAnimation();
                x.sprites.forEach((y) =>
                    y.filterManager.animate(deathAnimation, this.gameTime, Enemy.DEAD_FADE_OUT_MS)
                );
            }
        });

        // TODO: DRY Find a better way to do this!!
        this.bullets.forEach((x) => {
            const deathAnimation = FilterManager.blurFadeOutAnimation();
            x.sprites.forEach((y) =>
                y.filterManager.animate(deathAnimation, this.gameTime, Enemy.DEAD_FADE_OUT_MS)
            );
        });

        const justBeatBoss = this.isBossLevel();
        if (justBeatBoss) {
            this.shake();
            this.audioManager.play(AudioManager.SOUNDS.BOSS_DEAD);
            this.level.world.playBossCelebrationSongThen(() => {
                this.player.mover.setCollideWith({
                    ceiling: false, // allow the player to jump to the top
                    walls: true,
                    platforms: true,
                });
                this.state = GameState.WORLD_OUTRO;
            });

            this.state = GameState.BOSS_CELEBRATION;
            return;
        }

        this.transitionToNextLevel();
    }

    handleWorldOutroComplete() {
        this.background.fadeOut();
        this.platforms.fadeOut();
        this.player.fadeOut();

        // Beat the game?
        if (this.level.world.isLast()) {
            this.songHandler = this.audioManager.play(AudioManager.SOUNDS.FINALE_SONG);
            this.filterManager.animate(
                (fm, amountDone) => {
                    fm.blurPixels = amountDone * 8;
                    fm.brightnessPercent = 100 - 50 * amountDone;
                },
                this.gameTime,
                1000
            );
            const finalPoints = this.stats.points;
            if (LeaderBoard.isNewRecord(finalPoints)) {
                this.modal.showNewLeaderBoardRecord(finalPoints, true);
            } else {
                this.modal.showTabs('Game Complete', 'Play Again', () => {
                    this.songHandler.stop(); // Finale song
                    this.startNewGame();
                });
            }
            this.state = GameState.GAME_BEAT;
        } else {
            this.modal.showTabs(
                `World ${this.level.world.number} Complete`,
                'Continue',
                () => {
                    this.transitionToNextLevel();
                }
            );
            this.state = GameState.WORLD_WRAP_UP;
        }
    }

    transitionToNextLevel() {
        const justBeatBoss = this.isBossLevel();
        this.level = this.levelManager.getNextLevel();

        // Start the right song
        if (this.level.boss) {
            this.level.world.stopSong();
            this.level.world.playBossSong();
            this.audioManager.play(AudioManager.SOUNDS.START_BOSS_LEVEL);
        } else if (justBeatBoss) {
            this.level.world.playSong();
            this.background = new Background(this, true);
        }

        this.hud.displayLevel(this.level);
        this.platforms.handleLevelComplete(this.level.platformSprites);
        this.player.fadeIn();
        this.player.handelLevelComplete();

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
        if (this.responsiveCanvas.classList.contains('shake')) {
            this.responsiveCanvas.classList.remove('shake');
            this.responsiveCanvas.offsetWidth; // Force DOM reflow
        }
        this.responsiveCanvas.classList.add('shake');
    }

    isBossLevel() {
        return this.level && !!this.level.boss;
    }

    handleWindowResize() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
        const onScreenControlsGap = isMobile ? Game.ON_SCREEN_CONTROLS_HEIGHT : 0;

        const windowW = window.innerWidth;
        const windowH = window.innerHeight - Game.HUD_HEIGHT - onScreenControlsGap;
        const scale = Math.min(windowW / Game.WORLD_WIDTH, windowH / Game.WORLD_HEIGHT);

        const newWidth = Math.ceil(Game.WORLD_WIDTH * scale);
        const newHeight = Math.ceil(Game.WORLD_HEIGHT * scale);

        this.responsiveCanvas.width = newWidth;
        this.responsiveCanvas.height = newHeight;
        this.responsiveCanvas.style.width = `${newWidth}px`;
        this.responsiveCanvas.style.height = `${newHeight}px`;

        this.responsiveCanvas.style.left = `${Math.ceil(windowW * 0.5 - newWidth * 0.5)}px`;
        this.responsiveCanvas.style.top = `${Game.HUD_HEIGHT}px`;

        this.hudContainer.style.left = `${Math.ceil(windowW * 0.5 - newWidth * 0.5)}px`;
        this.hudContainer.style.width = `${newWidth}px`;

        this.onScreenControls.style.top = `${newHeight}px`;
        this.onScreenControls.style.width = `${newWidth}px`;
        this.onScreenControls.style.display = isMobile ? 'flex' : 'none';
    }

    pause() {
        // TODO: pause audio?
        this.wasMuted = this.audioManager.isMuted;
        this.audioManager.mute();
        this.isPaused = true;
    }

    resume() {
        // TODO: resume audio?
        if (!this.wasMuted) {
            this.audioManager.unmute();
        }
        this.lastUpdateTime = null;
        this.isPaused = false;
    }

    /*

TODO: Consider indexed tagging system for "renderables" or perhaps "entities"

export class MyGameObject extends GameObject {
    constructor() {
        super(['enemy-type:tower', 'render-layer:1']);
    }
}

game.addGameObject(myGameObject)

*/

    render() {
        const ctx = this.renderContext.getCanvasContext();
        this.filterManager.applyFilters(this, ctx, () => {
            this.background.render(this.renderContext);
            this.collectables.forEach((x) => x.render(this.renderContext));
            this.enemies
                .filter(
                    (x) =>
                        x.type !== EnemyTypes.BOMB &&
                        x.type !== EnemyTypes.ROCKET &&
                        x.type !== EnemyTypes.BIG_BOMB &&
                        x.type !== EnemyTypes.FINAL_BOSS
                )
                .forEach((x) => x.render(this.renderContext));
            this.player.render(this.renderContext);
            this.platforms.render(this.renderContext);
            this.enemies
                .filter((x) => x.type === EnemyTypes.BOMB || x.type === EnemyTypes.ROCKET)
                .forEach((x) => x.render(this.renderContext));
            this.enemies
                .filter((x) => x.type === EnemyTypes.BIG_BOMB || x.type === EnemyTypes.FINAL_BOSS)
                .forEach((x) => x.render(this.renderContext));
            this.bullets.forEach((x) => x.render(this.renderContext));
            this.overlayEntities.forEach((x) => x.render(this.renderContext));
        });

        const ctxResponsive = this.responsiveCanvas.getContext('2d');
        ctxResponsive.drawImage(
            this.canvas,
            0,
            0,
            this.responsiveCanvas.width,
            this.responsiveCanvas.height
        );
    }
}

new Game();
