import { Bomb } from './bomb.js';
import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Emitter } from './emitter.js';
import { RandomGenerator } from './randomGenerator.js';
import { Enemy } from './enemy.js';
import { FilterManager } from './filterManager.js';
import { Platforms } from './platforms.js';
import { GameState } from './gameState.js';
import { Rocket } from './rocket.js';

export class Tower extends Enemy {
    constructor(game, x, y) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.TOWER.width,
            SpriteLibrary.SIZES.TOWER.height,
            EnemyTypes.TURRET,
            true
        );
        const facingRight = x < game.canvas.width * 0.5;
        this.spriteIdle = facingRight
            ? SpriteLibrary.towerRightIdle()
            : SpriteLibrary.towerLeftIdle();
        this.spriteShoot = facingRight
            ? SpriteLibrary.towerRightShoot()
            : SpriteLibrary.towerLeftShoot();
        this.currentSprite = this.spriteIdle;
        this.spawnPosition = {
            x: facingRight ? x + this.currentSprite.width : x - this.currentSprite.width,
            y: y + 12,
        };
        this.bombSpawner = new Emitter({
            emit: (index) => {
                if (index === 3 || index === 8) {
                    this.currentSprite = this.spriteIdle;
                } else {
                    this.currentSprite = this.spriteShoot;
                    Rocket.spawn(
                        game,
                        this.spawnPosition.x,
                        this.spawnPosition.y,
                        facingRight ? 1 : -1
                    );
                }
                this.currentSprite.reset();
            },
            delays: [1000, 200, 200, 200, 2500, 200, 200, 200, 200],
        });
    }

    render(renderContext) {
        if (this.isDead) {
            if (this.currentSprite.filterManager.animation == null) {
                return;
            }
        }
        this.currentSprite.render(renderContext, this.x, this.y);
    }

    update() {
        super.update();
        if (this.isDead) {
            return;
        }
        if (this.currentSprite.reachedEnd) {
            this.currentSprite = this.spriteIdle;
            this.currentSprite.reset();
        }
        if (this.game.state === GameState.PLAYING) {
            this.bombSpawner.update();
        }
    }

    static spawn(game) {
        const eligiblePlatformYs = Platforms.getPlatformYs().filter((y, i) => i < 5);
        const x = RandomGenerator.randomBool()
            ? RandomGenerator.randomIntBetween(
                  1,
                  Math.ceil(game.canvas.width * 0.10)
              )
            : RandomGenerator.randomIntBetween(
                    Math.ceil(game.canvas.width * 0.90),
                    game.canvas.width - SpriteLibrary.SIZES.TOWER.width - 1
              );
        return new Tower(
            game,
            x,
            RandomGenerator.randomFromArray(eligiblePlatformYs) - SpriteLibrary.SIZES.TOWER.height
        );
    }

    handleShot() {
        super.handleShot();
        if (this.isDead) {
            this.currentSprite.filterManager.animate(FilterManager.blurFadeOutAnimation(), 250);
        }
    }
}
