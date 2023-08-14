import { AudioManager } from './audioManager.js';
import { Entity } from './entity.js';
import { FilterManager } from './filterManager.js';
import { PointBonus } from './pointBonus.js';

export class Enemy extends Entity {
    static DEFAULT_HEALTH = 1;
    static DEAD_FADE_OUT_MS = 500;
    static RECOVERY_TIME_MS = 4000;

    constructor(
        game,
        x,
        y,
        width,
        height,
        points,
        type,
        currentSprite,
        isShootable,
        health = Enemy.DEFAULT_HEALTH
    ) {
        super(game, x, y, width, height);
        this.points = points;
        this.type = type;
        this.currentSprite = currentSprite;
        this.isDead = false;
        this.isShootable = isShootable;
        this.recovering = false;
        this.health = health;
        this.sprites = [currentSprite];
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        // // Done recovering?
        if (
            this.recovering &&
            this.game.gameTime - this.recoveringStartTime > Enemy.RECOVERY_TIME_MS
        ) {
            this.recovering = false;
            this.recoveringStartTime = null;
            this.sprites.forEach((x) => x.filterManager.reset());
        }
    }

    render(renderContext) {
        if (this.isDead) {
            // Allow the enemy to fade out after dying
            if (this.currentSprite.filterManager.animation == null) {
                return;
            }
        }
        this.currentSprite.render(renderContext, this.x, this.y);
    }

    handleShot() {
        if (this.recovering || this.isDead) {
            return false;
        }
        if (this.isShootable) {
            this.game.audioManager.play(AudioManager.SOUNDS.ENEMY_HIT);
            this.health = Math.max(0, this.health - 1);
            this.isDead = this.health === 0;
            if (this.isDead) {
                this.game.stats.enemyKilled(this);
                this.game.overlayEntities.push(new PointBonus(this.game, this.x, this.y + this.height * 0.5, this.points));
                this.game.hud.displayPoints(this.game.stats.points);
                const deathAnimation = FilterManager.blurFadeOutAnimation();
                this.sprites.forEach((x) =>
                    x.filterManager.animate(
                        deathAnimation,
                        this.game.gameTime,
                        Enemy.DEAD_FADE_OUT_MS
                    )
                );
            } else {
                // Shot, but not dead
                this.recovering = true;
                this.recoveringStartTime = this.game.gameTime;
                const recoveringAnimation = FilterManager.recoveringAnimation();
                this.sprites.forEach((x) =>
                    x.filterManager.animate(
                        recoveringAnimation,
                        this.game.gameTime,
                        Enemy.RECOVERY_TIME_MS
                    )
                );
            }
            return true;
        }
        return false;
    }
}
