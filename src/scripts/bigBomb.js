import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { RandomGenerator } from './randomGenerator.js';
import { Mover } from './mover.js';
import { Enemy } from './enemy.js';
import { AudioManager } from './audioManager.js';

export class BigBomb extends Enemy {
    static VERTICAL_BUFFER = 50;

    constructor(game, x, y, sprite) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.BIG_BOMB.width,
            SpriteLibrary.SIZES.BIG_BOMB.height,
            0,
            EnemyTypes.BIG_BOMB,
            sprite,
            false
        );
        this.mover = new Mover(game, this);
        this.mover.setCollideWith({
            walls: false,
            ceiling: false,
            platforms: false,
        });
        this.mover.dropping = true;
        this.gravity = Mover.DEFAULT_GRAVITY * 0.8;
    }

    static spawn(game) {
        game.audioManager.play(AudioManager.SOUNDS.BIG_BOMB);
        return new BigBomb(
            game,
            RandomGenerator.randomIntBetween(
                BigBomb.VERTICAL_BUFFER,
                game.canvas.width - SpriteLibrary.SIZES.BIG_BOMB.width - BigBomb.VERTICAL_BUFFER
            ),
            1, // Important: spawn on screen
            SpriteLibrary.bigBomb()
        );
    }

    update() {
        super.update();
        if (this.isOffScreen) {
            return;
        }

        this.mover.update();
        this.isOffScreen = this.y > 800; // TODO: reference this.game.height
    }
}
