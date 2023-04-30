import { GameState } from './gameState.js';
import { Game } from './game.js';
import { Platforms } from './platforms.js';
import { Bullet } from './bullet.js';
import { AudioManager } from './audioManager.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Mover } from './mover.js';
import { Entity } from './entity.js';
import { Box } from './box.js';

export class Player extends Entity {
    static VERTICAL_SPEED = -8;
    static HORIZONTAL_SPEED = 4.5;
    static SHOOT_DELAY_MS = 250;
    static INITIAL_HEALTH = 3;
    static RECOVERY_TIME_MS = 4000;

    constructor(game) {
        super(
            Math.floor(game.canvas.width / 2.0 - SpriteLibrary.SIZES.PLAYER.width / 2.0),
            Math.floor(game.canvas.height - SpriteLibrary.SIZES.PLAYER.height),
            SpriteLibrary.SIZES.PLAYER.width,
            SpriteLibrary.SIZES.PLAYER.height
        );
        this.game = game;

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
                if (!enemy.isDead && hitBox.intersects(enemy)) {
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

        // Apply the direction of the player
        if (this.game.userControls.left) {
            this.facingRight = false;
        } else if (this.game.userControls.right) {
            this.facingRight = true;
        }

        // Shooting?
        if (this.game.userControls.shoot) {
            const now = Date.now();
            if (!this.lastShootTime || now - this.lastShootTime >= Player.SHOOT_DELAY_MS) {
                // Time to shoot
                this.game.audioManager.play(AudioManager.AUDIO_FILES.PLAYER_SHOOT);
                this.game.bullets.push(Bullet.spawn(this.game));
                this.lastShootTime = now;
            }
        }

        // Move player left or right
        if (this.game.userControls.left) {
            this.mover.setVelocityX(-Player.HORIZONTAL_SPEED);
        } else if (this.game.userControls.right) {
            this.mover.setVelocityX(Player.HORIZONTAL_SPEED);
        } else if (!this.jumping) {
            // Drift while jumping, but stop instantly on ground
            this.mover.setVelocityX(0);
        }

        // React to user jump
        if (!this.dropping && !this.jumping && this.game.userControls.jump) {
            this.game.audioManager.play(AudioManager.AUDIO_FILES.PLAYER_JUMP);
            this.mover.setVelocityY(Player.VERTICAL_SPEED);
            this.jumpingRightSprite.reset();
            this.jumpingLeftSprite.reset();
            this.jumping = true;
        }

        // React to user drop
        if (!this.dropping && !this.jumping && this.game.userControls.drop) {
            this.mover.setVelocityY(0);
            this.dropping = true;
        }

        // Platform detection while dropping or jumping

        // Apply gravity if jumping or dropping
        this.mover.setGravity(this.jumping || this.dropping ? Game.GRAVITY : 0);
        this.mover.update();

        // Platform detection while dropping
        if (
            (this.dropping && this.mover.velocity.y > Game.GRAVITY) || // Dropping, but after already falling
            (this.jumping && this.mover.velocity.y > 0.1) // "Jumping", but just after apex (> 0.1)
        ) {
            // See if we have crossed a platform while falling
            let roundedLastBottomY = Math.ceil(this.lastY + this.height);
            let roundedBottomY = Math.ceil(this.y + this.height);
            if (roundedLastBottomY <= roundedBottomY) {
                for (
                    let roundedBottom = roundedLastBottomY;
                    roundedBottom <= roundedBottomY;
                    roundedBottom++
                ) {
                    if (roundedBottom % Platforms.HEIGHT == 0) {
                        this.mover.stop();
                        this.y = roundedBottom - this.height;
                        this.jumping = false;
                        this.dropping = false;
                        break;
                    }
                }
            }
        }

        // Apply collision detection main canvas
        if (this.game.level.world.boss) {
            // Boss level?
            if (this.y <= 0) {
                // Stop at the top of the level
                this.y = 0;
            }
        }
        if (this.y + this.height > this.game.canvas.height) {
            this.y = this.game.canvas.height - this.height;
            this.mover.setVelocityY(0);
            this.jumping = false;
            this.dropping = false;
        }
        if (this.x + this.width > this.game.canvas.width) {
            this.x = this.game.canvas.width - this.width;
            this.mover.setVelocityX(0);
        }
        if (this.x <= 0) {
            this.x = 0;
            this.mover.setVelocityX(0);
        }

        this.lastY = this.y;
    }

    updateLevelTransition() {
        this.y += Game.LEVEL_SCROLL_SPEED;
    }

    render(renderContext) {
        // Render the current sprite
        if (this.jumping) {
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
        this.jumping = false;
        this.dropping = false;
        this.recovering = false;
        this.recoveringStartTime = null;
        this.sprites.forEach((x) => x.filterManager.reset());
        this.y = -this.height; // TODO: this needs to be fixed for boss levels; not sure what to do
    }

    handleLevelTransitionDone() {
        this.y = this.game.canvas.height - this.height;
        this.mover.stop();
    }

    setHealth(health) {
        // Reduction in health, but still alive?
        if (health > 0 && this.health > health) {
            this.recovering = true;
            this.recoveringStartTime = Date.now();

            const recoveringAnimation = (filterManager, amountDone) => {
                filterManager.hueDegrees = 360 - 360 * amountDone;
                filterManager.opacityPercent = 20 + 30 * amountDone;
            };
            this.sprites.forEach((x) =>
                x.filterManager.animate(recoveringAnimation, Player.RECOVERY_TIME_MS)
            );
        }

        if (health === 0) {
            // Dead
            this.jumping = false;
            this.dropping = false;
            this.recovering = false;
        }

        this.health = health;
        this.game.hud.displayHealth(this.health);
    }

    reset() {
        this.setHealth(Player.INITIAL_HEALTH);
        this.x = Math.floor(this.game.canvas.width / 2.0 - this.width / 2.0);
        this.y = Math.floor(this.game.canvas.height - this.height);
        this.lastY = this.y;
        this.mover = new Mover(this, 0);
        this.jumping = false;
        this.dropping = false;
        this.facingRight = false;
        this.lastShootTime = null;
        this.recovering = false;
        this.recoveringStartTime = null;
        this.sprites.forEach((x) => x.filterManager.reset());
    }
}
