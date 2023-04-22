export class Oscillator {
	static untilDuration(min, max, rate, duration) {
		let currentValue = min;
		let increasing = true;
		let startTime = null;
        const delta = (rate * (max - min)) / 1000;

		return function oscillate() {
            const now = Date.now();
			if (!startTime) {
				startTime = now;
			}
			const elapsedTime = now - startTime;
			if (elapsedTime >= duration) {
				return null; // reached the end of the oscillator
			}
			if (increasing) {
				currentValue += delta;
				if (currentValue >= max) {
					increasing = false;
				}
			} else {
				currentValue -= delta;
				if (currentValue <= min) {
					increasing = true;
				}
			}
			return currentValue;
		};
	}

	static untilTimes(min, max, rate, times) {
		let currentValue = min;
		let increasing = true;
		let count = 0;
        const delta = (rate * (max - min)) / 1000;

		return function oscillate() {
			if (times !== 0 && count >= times) {
				return null; // reached the end of the oscillator
			}
			if (increasing) {
				currentValue += delta;
				if (currentValue >= max) {
					increasing = false;
					count++;
				}
			} else {
				currentValue -= delta;
				if (currentValue <= min) {
					increasing = true;
					count++;
				}
			}
			return currentValue;
		};
	}
}
