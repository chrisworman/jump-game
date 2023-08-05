import { Collectable } from './collectable.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Mover } from './mover.js';
import { Platforms } from './platforms.js';
import { Velocity } from './velocity.js';
import { AudioManager } from './audioManager.js';

export class Shield extends Collectable {
    static TTL_SECONDS = 15;
    static SPAWN_WALL_PADDING = 100;
    static CHASE_SPEED = 9;
    static UNCOLLECTED_FLOAT_DISTANCE_X = 1.5;
    static UNCOLLECTED_FLOAT_DISTANCE_Y = 1.8;
    static UNCOLLECTED_VELOCITY_X = 0.02;
    static UNCOLLECTED_VELOCITY_Y = 0.03;

    constructor(game, x, y, sprite) {
        super(game, x, y, sprite);
        this.attached = false;
        this.ogX = x;
        this.ogY = y;
        this.mover = new Mover(game, this);
        this.mover.setVelocity(
            new Velocity(Shield.UNCOLLECTED_VELOCITY_X, -Shield.UNCOLLECTED_VELOCITY_Y)
        );
    }

    update() {
        super.update();

        // TODO: animate wobble when not collected using a mover

        let flickerRate = 0.007;

        if (this.collected) {
            // Handle time remaining
            const elapsedMs = this.game.gameTime - this.collectedTime;
            const timeRemainingSecs = Math.max(
                0,
                Shield.TTL_SECONDS - Math.floor(elapsedMs / 1000)
            );
            if (timeRemainingSecs !== this.lastTimeRemainingSecs) {
                this.game.hud.displayShield(timeRemainingSecs);
                this.lastTimeRemainingSecs = timeRemainingSecs;
            }

            // Increase flickering and opacity as the shield expires
            if (timeRemainingSecs <= 5) {
                flickerRate = timeRemainingSecs <= 3 ? 0.05 : 0.03;
                this.sprite.filterManager.opacityPercent = timeRemainingSecs <= 3 ? 45 : 70;
            }

            // Reset hue from enemy hit?
            const hue = this.sprite.filterManager.hueDegrees;
            if (hue > 0 && this.game.gameTime - this.hitEnemyTime > 800) {
                this.sprite.filterManager.hueDegrees = Math.max(0, hue - 2);
            }

            if (timeRemainingSecs === 0) {
                // Shield expired
                this.game.player.shield = null;
                if (!this.game.level.boss) {
                    this.game.level.world.playSong();
                }
            }

            // Handle attachment to player
            if (!this.attached) {
                // Chase player!
                const targetX = this.game.player.x - 5;
                const diffX = this.x - targetX;
                const deltaX =
                    Math.abs(diffX) > Shield.CHASE_SPEED
                        ? Math.sign(diffX) * Shield.CHASE_SPEED
                        : diffX;
                const newX = this.x - deltaX;

                const yOffset = this.game.player.mover.jumping ? 10 : 5;
                const targetY = this.game.player.y - yOffset;
                const diffY = this.y - targetY;
                const deltaY =
                    Math.abs(diffY) > Shield.CHASE_SPEED
                        ? Math.sign(diffY) * Shield.CHASE_SPEED
                        : diffY;
                const newY = this.y - deltaY;

                if (Math.abs(this.x - newX) <= 1 && Math.abs(this.y - newY) <= 1) {
                    this.attached = true;
                } else {
                    this.x = newX;
                    this.y = newY;
                }
            }
        } else {
            // Not collected
            this.mover.update();
            if (Math.abs(this.x - this.ogX) >= Shield.UNCOLLECTED_FLOAT_DISTANCE_X) {
                this.mover.setVelocityX(-this.mover.velocity.x);
            }
            if (Math.abs(this.y - this.ogY) >= Shield.UNCOLLECTED_FLOAT_DISTANCE_Y) {
                this.mover.setVelocityY(-this.mover.velocity.y);
            }
        }

        // Animate brightness
        this.sprite.filterManager.brightnessPercent =
            ((Math.sin(this.game.gameTime * flickerRate) + 1) / 2.0) * 70 + 80;
    }

    render(renderContext) {
        if (this.attached) {
            const yOffset = this.game.player.mover.jumping ? 10 : 5;
            this.sprite.render(renderContext, this.game.player.x - 10, this.game.player.y - yOffset);
        } else {
            this.sprite.render(renderContext, this.x, this.y);
        }
    }

    onCollected() {
        this.collectedTime = this.game.gameTime;
        this.lastTimeRemainingSecs = Shield.TTL_SECONDS;
        this.attached = false;
        this.game.player.shield = this;
        this.game.hud.displayShield(this.lastTimeRemainingSecs);
        this.game.collectables = this.game.collectables.filter((x) => x !== this);
        this.game.level.world.stopSong();
        this.game.audioManager.play(AudioManager.SOUNDS.SHIELD_SONG);
    }

    onHitEnemy(enemy) {
        this.sprite.filterManager.hueDegrees = 180;
        this.hitEnemyTime = this.game.gameTime;
        enemy.handleShot();
    }

    static spawn(game) {
        // Position the shield away from the player in the middle of the platform
        const x =
            game.player.x <= game.canvas.width * 0.5
                ? game.canvas.width - SpriteLibrary.SIZES.SHIELD.width - Shield.SPAWN_WALL_PADDING
                : Shield.SPAWN_WALL_PADDING;
        const y =
            game.canvas.height -
            SpriteLibrary.SIZES.SHIELD.height * 0.5 -
            Platforms.HEIGHT * 0.5 +
            Platforms.FLOOR_HEIGHT;
        return new Shield(game, x, y, SpriteLibrary.shield());
    }
}
