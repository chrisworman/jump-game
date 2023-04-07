export class AnimatedSprite {
	constructor(imagePath, xs, ys, width, height, fps = 12) {
        // By convention, sprite sheets are always 
		this.xs = xs;
		this.ys = ys;
        this.frameCount = xs.length;
		this.width = width;
		this.height = height;
        this.fps = fps;
        this.frameFactor = this.fps / 1000;
		this.loaded = false;
		this.image = new Image();
		this.image.addEventListener('load', () => {
			this.loaded = true;
		});
		this.image.src = imagePath;
        this.startTime = -1;
	}

    reset() {
        this.startTime = -1;
    }

    sync(other) {
        this.startTime = other.startTime;
    }

	render(renderContext, x, y) {
		if (this.loaded) {
            let now = Date.now();
            if (this.startTime === -1) {
                this.startTime = now;
            }
            var elapsedMs = now - this.startTime; // renderContext.getElapsedTime();
            var frameIndex = Math.floor(elapsedMs * this.frameFactor % this.frameCount);
			renderContext.getCanvasContext().drawImage(
				this.image,
				this.xs[frameIndex],
				this.ys[frameIndex],
				this.width,
				this.height,
				x,
				y,
				this.width,
				this.height
			);
		}
	}
}
