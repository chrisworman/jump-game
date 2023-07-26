import { Velocity } from './velocity.js';
import { Game } from './game.js';
import { Platforms } from './platforms.js';

// An entity behaviour that provides movement like jumping, dropping, and moving left or right.
// Optionally provides platform and ceiling collision detection.
export class Mover {
    static DEFAULT_GRAVITY = 0.3;

    constructor(game, target) {
        this.game = game;
        this.movementFactor = 60 / Game.FPS;
        this.target = target;
        this.lastY = this.target.y;
        this.collideWith = {
            ceiling: true,
            walls: true,
            platforms: true,
        };
        this.velocity = new Velocity();
        this.jumping = false;
        this.dropping = false;
        this.onPlatform = null;
        this.pacing = false;
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

    setCollideWith({ platforms = true, walls = true, ceiling = true }) {
        this.collideWith = { platforms, walls, ceiling };
    }

    stop() {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.pacing = false;
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

    isMovingLeft() {
        return this.velocity.x < 0;
    }

    isMovingRight() {
        return this.velocity.x > 0;
    }

    pace(velocityX = 4.5) {
        this.setVelocityX(velocityX);
        this.pacing = true;
        this.collideWith.walls = true;
    }

    setOnPlatform(onPlatform) {
        this.onPlatform = onPlatform;
    }

    update() {
        const gravity = this.target.gravity || Mover.DEFAULT_GRAVITY;

        // Apply gravity if we are not on a platform
        if (this.jumping || this.dropping) {
            this.velocity.y += gravity * this.movementFactor;
        }

        // Apply velocity
        this.target.y += this.velocity.y * this.movementFactor;
        this.target.x += this.velocity.x * this.movementFactor;

        // Platform collision
        if (this.collideWith.platforms) {
            if (
                (this.dropping && this.velocity.y > gravity) || // Dropping, but after already falling
                (this.jumping && this.velocity.y > 0.1) // "Jumping", but just after apex (> 0.1)
            ) {
                // See if we have crossed a platform while falling
                let lastBase = Math.ceil(this.lastY + this.target.height);
                let curBase = Math.ceil(this.target.y + this.target.height);
                if (lastBase <= curBase) {
                    for (let base = lastBase; base <= curBase; base++) {
                        if (base % Platforms.HEIGHT === 0) {
                            // We've hit a platform
                            if (this.pacing) {
                                this.setVelocityY(0);
                            } else {
                                this.stop();
                            }
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
        }

        const canvas = this.game.canvas;

        // Ceiling collision
        if (this.collideWith.ceiling && this.target.y <= 0) {
            this.target.y = 0;
        }

        // Walls
        if (this.collideWith.walls) {
            // Right wall
            if (this.target.x + this.target.width > canvas.width) {
                this.target.x = canvas.width - this.target.width;
                if (this.pacing) {
                    this.target.x = this.target.x - 1;
                    this.left(Math.abs(this.velocity.x));
                } else {
                    this.setVelocityX(0);
                }
            }
            // Left wall
            if (this.target.x <= 0) {
                this.target.x = 0;
                if (this.pacing) {
                    this.target.x = 1;
                    this.right(Math.abs(this.velocity.x));
                } else {
                    this.setVelocityX(0);
                }
            }
        }

        this.lastY = this.target.y;
    }
}
