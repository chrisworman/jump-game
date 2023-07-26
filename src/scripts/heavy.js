import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Emitter } from './emitter.js';
import { Bomb } from './bomb.js';
import { Platforms } from './platforms.js';
import { RandomGenerator } from './randomGenerator.js';
import { GameState } from './gameState.js';

export class Heavy extends Enemy {
    static HEALTH = 2;
    static SPEED = 0.8;
    static RECOVERY_TIME_MS = 3000;

    constructor(game, x, y, currentSprite) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.HEAVY.width,
            SpriteLibrary.SIZES.HEAVY.height,
            EnemyTypes.HEAVY,
            currentSprite,
            true,
            Heavy.HEALTH
        );

        this.mover = new Mover(game, this);
        this.mover.pace(Heavy.SPEED);

        this.emitter = new Emitter(game, {
            emit: () => {
                const bomb = Bomb.spawn(
                    this.game,
                    this.x + this.width * 0.5,
                    this.y + this.height,
                    0
                );
                bomb.mover.setVelocityX(0);
                bomb.mover.setVelocityY(0);
            },
            delays: [2000, 400, 400, 400, 400, 400],
        });
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        if (this.game.state === GameState.PLAYING) {
            // Done recovering?
            if (
                this.recovering &&
                this.game.gameTime - this.recoveringStartTime > Heavy.RECOVERY_TIME_MS
            ) {
                this.recovering = false;
                this.recoveringStartTime = null;
                this.sprites.forEach((x) => x.filterManager.reset());
            }

            this.mover.update();
            this.emitter.update();
        }
    }

    static spawn(game) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 3);
        return new Heavy(
            game,
            RandomGenerator.randomIntBetween(
                1,
                game.canvas.width - SpriteLibrary.SIZES.HEAVY.width - 1
            ),
            RandomGenerator.randomFromArray(eligiblePlatformYs) - SpriteLibrary.SIZES.HEAVY.height,
            SpriteLibrary.heavyIdle()
        );
    }
}
