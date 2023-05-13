import { RandomGenerator } from './randomGenerator.js';
import { SpriteLibrary } from './spriteLibrary.js';

export class Spawner {
    static MAX_LOOPS = 100; // Avoid infinte loops

    constructor(spawnEntity) {
        this.spawnEntity = spawnEntity;
    }

    spawnWithoutIntersecting(entitiesToAvoid) {
        let spawned = null;
        let intersects = false;
        let loops = 0;
        do {
            spawned = this.spawnEntity();
            intersects = entitiesToAvoid.some((entity) => entity.intersects(spawned));
            loops++;
        } while (intersects && loops < Spawner.MAX_LOOPS);

        return spawned;
    }
}
