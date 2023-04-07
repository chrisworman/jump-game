import { Sprite } from "./sprite.js";
import { AnimatedSprite } from "./animatedSprite.js";
import {
    randomXYIn,
    findOverlapping,
    rectanglesOverlap,
} from "./utils.js";

export class Collectable {
	// static #WIDTH = 50;
	// static #HEIGHT = 49;
    static #SPAWN_BOTTOM_BUFFER = 100;

	constructor(x, y, sprite, points, width, height, onCollected) {
        this.collected = false;
		this.x = x;
		this.y = y;
        this.width = width;
        this.height = height;
		this.sprite = sprite;
        this.sprite.opacity = 0.75;
        this.points = points;
        this.onCollected = onCollected;
	}

	static spawn(others, canvas, onCollected) {
        let xy = null;
        let overlapping = null;
        let maxLoops = 100;
        let loops = 0;
        do {
            xy = randomXYIn(
                50,
                50,
                canvas.width,
                canvas.height - Collectable.#SPAWN_BOTTOM_BUFFER,
            );
            overlapping = findOverlapping({
                x: xy.x,
                y: xy.y,
                width: 50,
                height: 50,
            }, others);
            loops++;
        } while (overlapping.length > 0 && loops < maxLoops);

        // let dice = Math.random();
        // if (dice < 0.7) {
            let xs = [];
            let ys = [];
            for (let i=0; i < 22; i++) {
                xs[i] = i*48;
                ys[i] = 0;
            }
            return new Collectable(
                xy.x,
                xy.y,
                new AnimatedSprite(
                    "red-gem-48-48.png",
                    xs,
                    ys,
                    48,
                    48,
                    12,
                ),
                50,
                48,
                48,
                onCollected);
        // } else if (dice < 0.95) {
        //     return new Collectable(xy.x, xy.y, new Sprite('gem-stone-pink-purple-1.png'), 100, 50, 50, onCollected);
        // } else {
        //     return new Collectable(xy.x, xy.y, new Sprite('golden-shield-1.png'), 250, 50, 47, onCollected); 
        // } 
	}

    update(player) {
        if (!this.collected && rectanglesOverlap(player, this)) {
            this.collected = true;
            this.onCollected(this.points);
        }
    }

	render(renderContext) {
        if (this.collected) {
            return;
        }
		this.sprite.render(renderContext, this.x, this.y);
	}
}
