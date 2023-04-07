export class AnimatedSprite {
	constructor(imagePath, width, height, yOffset, frameCount, fps = 12) {
        // By convention, sprite sheets for animations are always left to right horizontal
		this.xOffsets = Array(frameCount);
		this.yOffset = yOffset;
		for (let i=0; i<frameCount; i++) {
			this.xOffsets[i] = i * width;
		}
        this.frameCount = frameCount;
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
            var elapsedMs = now - this.startTime;
            var frameIndex = Math.floor(elapsedMs * this.frameFactor % this.frameCount);
			renderContext.getCanvasContext().drawImage(
				this.image,
				this.xOffsets[frameIndex],
				this.yOffset,
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
