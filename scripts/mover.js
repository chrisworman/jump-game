import { Velocity } from "./velocity.js";
import { Game } from "./game.js";

export class Mover {
    constructor(target, gravity = Game.GRAVITY) {
        this.target = target;
        this.velocity = new Velocity();
        this.gravity = gravity;
    }

    setGravity(gravity) {
        this.gravity = gravity;
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

    stop() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    update() {
        this.velocity.y += this.gravity;
        this.target.y += this.velocity.y;
        this.target.x += this.velocity.x;
    }
}
