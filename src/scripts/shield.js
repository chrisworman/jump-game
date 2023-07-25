import { Collectable } from './collectable.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Mover } from './mover.js';
import { Platforms } from './platforms.js';

export class Shield extends Collectable {
    static TTL_SECONDS = 10;
    static SPAWN_WALL_PADDING = 50;
    static CHASE_SPEED = 9;

    constructor(game, x, y, sprite) {
        super(game, x, y, sprite);
        this.attached = false;
        this.mover = new Mover(game, this);
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
            // Speed up flickering as the shield expires
            if (timeRemainingSecs < 5) {
                flickerRate = timeRemainingSecs < 3 ? 0.05 : 0.01;
            }
            if (timeRemainingSecs === 0) {
                // Shield expired
                this.game.player.shield = null;
            }

            // Handle attachment to player
            if (!this.attached) {
                // Chase player!
                const targetX = this.game.player.x - 5;
                const diffX = this.x - targetX;
                const deltaX = Math.abs(diffX) > Shield.CHASE_SPEED
                    ? Math.sign(diffX) * Shield.CHASE_SPEED
                    : diffX;
                const newX = this.x - deltaX;

                const yOffset = this.game.player.mover.jumping ? 10 : 5;
                const targetY = this.game.player.y - yOffset;
                const diffY = this.y - targetY;
                const deltaY = Math.abs(diffY) > Shield.CHASE_SPEED
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
        }

        // Animate brightness
        this.sprite.filterManager.brightnessPercent =
            ((Math.sin(this.game.gameTime * flickerRate) + 1) / 2.0) * 50 + 80;
    }

    render(renderContext) {
        if (this.attached) {
            const yOffset = this.game.player.mover.jumping ? 10 : 5;
            this.sprite.render(renderContext, this.game.player.x - 5, this.game.player.y - yOffset);
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
