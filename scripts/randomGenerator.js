export class RandomGenerator {
    static randomXYIn(itemWidth, itemHeight, canvasWidth, canvasHeight) {
        return {
            x: RandomGenerator.randomIntBetween(0, canvasWidth - itemWidth),
            y: RandomGenerator.randomIntBetween(0, canvasHeight - itemHeight),
        };
    }

    static randomIntBetween(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomFromArray(array) {
        return array[RandomGenerator.randomIntBetween(0, array.length - 1)];
    }

    static randomSign() {
        return RandomGenerator.randomIntBetween(0, 1) === 0 ? -1 : 1;
    }
}