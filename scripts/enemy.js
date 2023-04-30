import { Entity } from './entity.js';

export class Enemy extends Entity {
    static DEFAULT_HEALTH = 1;

    constructor(x, y, width, height, type, isShootable, health = Enemy.DEFAULT_HEALTH) {
        super(x, y, width, height);
        this.type = type;
        this.isDead = false;
        this.isShootable = isShootable;
        this.health = health;
    }

    handleShot() {
        if (this.isShootable) {
            this.health = Math.max(0, this.health - 1);
            this.isDead = this.health === 0;
        }
    }
}
