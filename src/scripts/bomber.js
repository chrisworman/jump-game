import { Enemy } from './enemy.js';
import { EnemyTypes } from './enemyTypes.js';
import { Mover } from './mover.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Emitter } from './emitter.js';
import { Bomb } from './bomb.js';
import { Platforms } from './platforms.js';
import { RandomGenerator } from './randomGenerator.js';
import { GameState } from './gameState.js';

export class Bomber extends Enemy {
    static HEALTH = 2;
    static SPEED = 0.8;
    static RECOVERY_TIME_MS = 2000;

    constructor(game, x, y, spriteIdle) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.BOMBER.width,
            SpriteLibrary.SIZES.BOMBER.height,
            50,
            EnemyTypes.BOMBER,
            spriteIdle,
            true,
            Bomber.HEALTH
        );

        this.spriteIdle = spriteIdle;
        this.spriteShoot = SpriteLibrary.bomberShoot();
        this.sprites = [this.spriteIdle, this.spriteShoot];

        this.mover = new Mover(game, this);
        this.mover.pace(Bomber.SPEED);

        this.emitter = new Emitter(game, {
            emit: (i) => {
                if (i === 0 || i === 1) {
                    if (i === 0) {
                        this.currentSprite = this.spriteShoot;
                        this.currentSprite.reset();
                    }
                    const bomb = Bomb.spawn(
                        this.game,
                        this.x + this.width * (i === 0 ? 0.1 : 0.5),
                        this.y + this.height,
                        0
                    );
                    bomb.mover.setVelocityX(0);
                    bomb.mover.setVelocityY(0);
                } else {
                    this.currentSprite = this.spriteIdle;
                }
            },
            delays: [RandomGenerator.randomIntBetween(2000, 4000), 1000, 1000],
        });
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }

        this.mover.update();

        if (this.game.state === GameState.PLAYING) {
            this.emitter.update();
        }
    }

    static spawn(game, x = null, y = null) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 2);
        return new Bomber(
            game,
            x ||
                RandomGenerator.randomIntBetween(
                    1,
                    game.canvas.width - SpriteLibrary.SIZES.BOMBER.width - 1
                ),
            y ||
                RandomGenerator.randomFromArray(eligiblePlatformYs) -
                    SpriteLibrary.SIZES.BOMBER.height,
            SpriteLibrary.bomberIdle()
        );
    }
}
