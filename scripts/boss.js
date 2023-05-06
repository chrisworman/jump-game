import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes';
import { SpriteLibrary } from './spriteLibrary.js';

export class Boss extends Enemy {
    constructor(game, x, y) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.BOSS.width,
            SpriteLibrary.SIZES.BOSS.height,
            EnemyTypes.BOSS,
            true,
            3
        );
        this.sprite = SpriteLibrary.boss();
    }

    render(renderContext) {
        if (this.isDead) {
            return;
        }
        this.sprite.render(renderContext, this.x, this.y);
    }

    update() {
        if (this.isDead) {
            return;
        }
    }
}
