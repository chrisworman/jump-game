export class Emitter {
    constructor(options) {
        this.lastEmitTime = Date.now();
        this.options = options;
        this.delayIndex = 0;
    }

    update() {
        if (this.options.delays) {
            this.updateWithDelays();
            return;
        }
    }

    updateWithDelays() {
        const elapsed = Date.now() - this.lastEmitTime;
        if (elapsed >= this.options.delays[this.delayIndex]) {
            this.lastEmitTime = Date.now();
            this.options.emit();
            this.delayIndex = (this.delayIndex + 1) % this.options.delays.length;
        }
    }

    // TODO: updateWithRandomDelays
}
