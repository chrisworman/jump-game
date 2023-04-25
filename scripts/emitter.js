import { randomIntBetween } from "./utils.js";

export class Emitter {
	constructor(options) {
		this.lastEmitTime = Date.now();
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
		const elapsed = Date.now() - this.lastEmitTime;
		if (elapsed >= this.options.delays[this.delayIndex]) {
			this.lastEmitTime = Date.now();
			this.options.emit();
			this.delayIndex =
				(this.delayIndex + 1) % this.options.delays.length;
		}
	}

	updateWithRandomDelays() {
		if (this.currentRandomDelay === null) {
			this.currentRandomDelay = randomIntBetween(
				this.options.randomDelays.min,
				this.options.randomDelays.max
			);
		}

		const elapsed = Date.now() - this.lastEmitTime;
		if (elapsed >= this.currentRandomDelay) {
			this.lastEmitTime = Date.now();
			this.options.emit();
			this.currentRandomDelay = null;
		}
	}

	// TODO: updateWithRandomDelays
}
