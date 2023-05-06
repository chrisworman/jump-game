import { Velocity } from './velocity.js';
import { Game } from './game.js';
import { Platforms } from './platforms.js';

// An entity behaviour that provides movement like jumping, dropping, and moving left or right.
// Optionally provides platform and ceiling collision detection.
export class Mover {
    constructor(game, target, platformCollisions = true, ceilingCollisions = true) {
        this.game = game;
        this.target = target;
        this.lastY = this.target.y;
        this.platformCollisions = platformCollisions;
        this.ceilingCollisions = ceilingCollisions;
        this.velocity = new Velocity();
        this.jumping = false;
        this.dropping = false;
        this.onPlatform = null;
    }

    setGravity(gravity) {
        Game.GRAVITY = gravity;
    }

    setVelocity(velocity) {
        this.velocity = velocity;
    }

    setVelocityX(x) {
        this.velocity.x = x;
    }

    setVelocityY(y) {
        this.velocity.y = y;
    }

    setCeilingCollisions(ceilingCollisions) {
        this.ceilingCollisions = ceilingCollisions;
    }

    stop() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    jump(velocityY = -8) {
        if (!this.dropping && !this.jumping) {
            this.jumping = true;
            this.setVelocityY(velocityY);
        }
    }

    drop() {
        if (!this.dropping && !this.jumping && !this.target.onFloor()) {
            this.setVelocityY(0);
            this.dropping = true;
        }
    }

    left(velocityX = 4.5) {
        this.setVelocityX(-velocityX);
    }

    right(velocityX = 4.5) {
        this.setVelocityX(velocityX);
    }

    setOnPlatform(onPlatform) {
        this.onPlatform = onPlatform;
    }

    update() {
        // Apply gravity if we are not on a platform
        if (this.jumping || this.dropping) {
            this.velocity.y += Game.GRAVITY;
        }

        // Move the target according to their velocity
        this.target.y += this.velocity.y;
        this.target.x += this.velocity.x;

        // Platform collision detection
        if (this.platformCollisions) {
            if (
                (this.dropping && this.velocity.y > Game.GRAVITY) || // Dropping, but after already falling
                (this.jumping && this.velocity.y > 0.1) // "Jumping", but just after apex (> 0.1)
            ) {
                // See if we have crossed a platform while falling
                let lastBase = Math.ceil(this.lastY + this.target.height);
                let curBase = Math.ceil(this.target.y + this.target.height);
                if (lastBase <= curBase) {
                    for (let base = lastBase; base <= curBase; base++) {
                        if (base % Platforms.HEIGHT == 0) {
                            // We've hit a platform
                            this.stop();
                            this.target.y = base - this.target.height;
                            this.jumping = false;
                            this.dropping = false;
                            if (this.onPlatform) {
                                this.onPlatform();
                            }
                            break;
                        }
                    }
                }
            }

            // Ceiling collision
            const canvas = this.game.canvas;
            if (this.ceilingCollisions && this.target.y <= 0) {
                this.target.y = 0;
            }

            // Right wall collision
            if (this.target.x + this.target.width > canvas.width) {
                this.target.x = canvas.width - this.target.width;
                this.setVelocityX(0);
            }

            // Left wall collision
            if (this.target.x <= 0) {
                this.target.x = 0;
                this.setVelocityX(0);
            }

            this.lastY = this.target.y;
        }
    }
}
