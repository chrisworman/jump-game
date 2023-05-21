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

    static randomBool(probability = 0.5) {
        return Math.random() < probability;
    }

    static randomizeArray(array) {
        const newArray = array.slice();
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}
