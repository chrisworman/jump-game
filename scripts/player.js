import { GameState } from './gameState.js';
import { Game } from './game.js';
import { Bullet } from './bullet.js';
import { AudioManager } from './audioManager.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Mover } from './mover.js';
import { Entity } from './entity.js';
import { Box } from './box.js';
import { FilterManager } from './filterManager.js';

export class Player extends Entity {
    static VERTICAL_SPEED = -8;
    static HORIZONTAL_SPEED = 4.5;
    static SHOOT_DELAY_MS = 250;
    static MAX_HEALTH = 3;
    static RECOVERY_TIME_MS = 4000;

    constructor(game) {
        super(
            game,
            Math.floor(game.canvas.width / 2.0 - SpriteLibrary.SIZES.PLAYER.width / 2.0),
            Math.floor(game.canvas.height - SpriteLibrary.SIZES.PLAYER.height),
            SpriteLibrary.SIZES.PLAYER.width,
            SpriteLibrary.SIZES.PLAYER.height
        );
        this.standingLeftSprite = SpriteLibrary.playerStandingLeft();
        this.standingRightSprite = SpriteLibrary.playerStandingRight();
        this.jumpingLeftSprite = SpriteLibrary.playerJumpingLeft();
        this.jumpingRightSprite = SpriteLibrary.playerJumpingRight();
        this.sprites = [
            this.standingLeftSprite,
            this.standingRightSprite,
            this.jumpingLeftSprite,
            this.jumpingRightSprite,
        ];

        this.reset();
    }

    getHitBox() {
        return new Box(this.x, this.y + 15, this.width - 15, this.height);
    }

    update() {
        switch (this.game.state) {
            case GameState.PLAYING:
                this.updatePlaying();
                break;
            case GameState.LEVEL_TRANSITION:
                this.updateLevelTransition();
                break;
        }
    }

    updatePlaying() {
        // Check enemy collisions: TODO: should this be in enemy?
        if (!this.recovering) {
            const hitBox = this.getHitBox();
            for (let enemy of this.game.enemies) {
                if (!enemy.isDead && !enemy.isOffScreen && hitBox.intersects(enemy)) {
                    this.game.shake();
                    this.game.audioManager.play(AudioManager.AUDIO_FILES.PLAYER_HIT);
                    this.setHealth(this.health - 1);
                    break;
                }
            }
        }

        // Done recovering?
        if (this.recovering && Date.now() - this.recoveringStartTime > Player.RECOVERY_TIME_MS) {
            this.recovering = false;
            this.recoveringStartTime = null;
            this.sprites.forEach((x) => x.filterManager.reset());
        }

        // Shooting?
        if (this.game.userControls.shoot) {
            const now = Date.now();
            if (!this.lastShootTime || now - this.lastShootTime >= Player.SHOOT_DELAY_MS) {
                // Time to shoot
                this.game.audioManager.play(AudioManager.AUDIO_FILES.PLAYER_SHOOT);
                Bullet.spawn(this.game);
                this.lastShootTime = now;
            }
        }

        // Move player left or right
        if (this.game.userControls.left) {
            this.facingRight = false;
            this.mover.left(Player.HORIZONTAL_SPEED);
        } else if (this.game.userControls.right) {
            this.facingRight = true;
            this.mover.right(Player.HORIZONTAL_SPEED);
        } else if (!this.mover.jumping) {
            // Drift while jumping, but stop instantly on ground
            this.mover.setVelocityX(0);
        }

        // React to user jump
        if (!this.mover.dropping && !this.mover.jumping && this.game.userControls.jump) {
            this.game.audioManager.play(AudioManager.AUDIO_FILES.PLAYER_JUMP);
            this.mover.jump(Player.VERTICAL_SPEED);
            this.jumpingRightSprite.reset();
            this.jumpingLeftSprite.reset();
        }

        // React to user drop
        if (!this.mover.dropping && !this.mover.jumping && this.game.userControls.drop) {
            this.mover.drop();
        }

        // Update the mover
        this.mover.update();
    }

    updateLevelTransition() {
        this.y += Game.LEVEL_SCROLL_SPEED;
    }

    render(renderContext) {
        // Render the current sprite
        if (this.mover.jumping) {
            if (this.facingRight) {
                this.jumpingRightSprite.render(renderContext, this.x, this.y);
            } else {
                this.jumpingLeftSprite.render(renderContext, this.x, this.y);
            }
        } else {
            // standing or dropping
            if (this.facingRight) {
                this.standingRightSprite.render(renderContext, this.x, this.y);
            } else {
                this.standingLeftSprite.render(renderContext, this.x, this.y);
            }
        }
    }

    handelLevelComplete() {
        this.mover.jumping = false;
        this.mover.dropping = false;
        this.recovering = false;
        this.recoveringStartTime = null;
        this.sprites.forEach((x) => x.filterManager.reset());
        this.y = -this.height; // TODO: this needs to be fixed for boss levels; not sure what to do
    }

    handleLevelTransitionDone() {
        this.y = this.game.canvas.height - this.height;
        this.mover.stop();
        this.mover.setCollideWith({
            ceiling: this.game.isBossLevel(),
            walls: true,
            platforms: true,
        });
    }

    setHealth(health) {
        // Reduction in health, but still alive?
        if (health > 0 && this.health > health) {
            this.recovering = true;
            this.recoveringStartTime = Date.now();

            const recoveringAnimation = FilterManager.recoveringAnimation();
            this.sprites.forEach((x) =>
                x.filterManager.animate(recoveringAnimation, Player.RECOVERY_TIME_MS)
            );
        }

        if (health === 0) {
            // Dead
            this.mover.jumping = false;
            this.mover.dropping = false;
            this.recovering = false;
        }

        this.health = health;
        this.game.hud.displayHealth(this.health);
    }

    reset() {
        this.setHealth(Player.MAX_HEALTH);
        this.x = Math.floor(this.game.canvas.width / 2.0 - this.width / 2.0);
        this.y = Math.floor(this.game.canvas.height - this.height);
        this.mover = new Mover(this.game, this);
        this.mover.setCollideWith({
            ceiling: this.game.isBossLevel(),
            walls: true,
            platforms: true,
        });
        this.facingRight = false;
        this.lastShootTime = null;
        this.recovering = false;
        this.recoveringStartTime = null;
        this.sprites.forEach((x) => x.filterManager.reset());
    }
}
