import { RandomGenerator } from './randomGenerator.js';

export class Emitter {
    constructor(game, options) {
        this.game = game;
        this.lastEmitTime = this.game.gameTime;
        this.options = options;
        this.delayIndex = 0;
        this.currentRandomDelay = null;
    }

    update() {
        if (this.options.delays) {
            this.updateWithDelays();
        } else if (this.options.randomDelays) {
            this.updateWithRandomDelays();
        }
    }

    updateWithDelays() {
        this.lastEmitTime = this.lastEmitTime || this.game.gameTime;
        const elapsed = this.game.gameTime - this.lastEmitTime;
        if (elapsed >= this.options.delays[this.delayIndex]) {
            this.lastEmitTime = this.game.gameTime;
            this.options.emit(this.delayIndex);
            this.delayIndex = (this.delayIndex + 1) % this.options.delays.length;
        }
    }

    updateWithRandomDelays() {
        if (this.currentRandomDelay === null) {
            this.currentRandomDelay = RandomGenerator.randomIntBetween(
                this.options.randomDelays.min,
                this.options.randomDelays.max
            );
        }

        const elapsed = this.game.gameTime - this.lastEmitTime;
        if (elapsed >= this.currentRandomDelay) {
            this.lastEmitTime = this.game.gameTime;
            this.options.emit();
            this.currentRandomDelay = null;
        }
    }
}
