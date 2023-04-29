export class Enemy {
    constructor(type, isShootable) {
        this.type = type
        this.isDead = false;
        this.isShot = false;
        this.isShootable = isShootable;
    }

    handleShot() {
        if (this.isShootable) {
            this.isShot = true;
        }
    }
}
