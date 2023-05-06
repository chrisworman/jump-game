import { Bomb } from './bomb.js';
import { EnemyTypes } from './enemyTypes.js';
import { SpriteLibrary } from './spriteLibrary.js';
import { Emitter } from './emitter.js';
import { RandomGenerator } from './randomGenerator.js';
import { Enemy } from './enemy.js';
import { FilterManager } from './filterManager.js';

export class FireFlower extends Enemy {
    constructor(game, x, y) {
        super(
            game,
            x,
            y,
            SpriteLibrary.SIZES.FIRE_BALL.width,
            SpriteLibrary.SIZES.FIRE_BALL.height,
            EnemyTypes.FIRE_FLOWER,
            true
        );
        this.sprite = SpriteLibrary.fireBall(); // TODO: proper sprite
        this.spawnPosition = {
            x: x + this.sprite.width * 0.5,
            y: y,
        };
        this.bombSpawner = new Emitter({
            emit: () => {
                game.enemies.push(
                    Bomb.spawn(
                        game,
                        this.spawnPosition.x,
                        this.spawnPosition.y,
                        RandomGenerator.randomSign(),
                        SpriteLibrary.bullet() // TODO: proper sprite
                    )
                );
            },
            // randomDelays: { min: 500, max: 3000 },
            delays: [200, 200, 200, 500, 200, 200, 200, 2000],
        });
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
        this.bombSpawner.update();
    }
}
