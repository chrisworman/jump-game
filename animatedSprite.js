import { FilterManager } from "./filterManager.js";

export class AnimatedSprite {
	constructor(imagePath, width, height, yOffset, frameCount, fps = 12, loop = true) {
        // By convention, sprite sheets for animations are always left to right horizontal
		this.xOffsets = Array(frameCount);
		this.yOffset = yOffset;
		for (let i=0; i<frameCount; i++) {
			this.xOffsets[i] = i * width;
		}
        this.frameCount = frameCount;
		this.startTime = -1;
		this.loop = loop;
		this.reachedEnd = false;
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
		this.filterManager = new FilterManager();
	}

    reset() {
        this.startTime = -1;
		this.reachedEnd = false;
    }

    sync(other) {
        this.startTime = other.startTime;
    }

	render(renderContext, x, y) {
		if (this.loaded) {

			// Capture start time
            let now = Date.now();
            if (this.startTime === -1) {
                this.startTime = now;
            }

			// Get the next frame index, considering looping
			var frameIndex = 0;
			if (!this.loop && this.reachedEnd) {
				frameIndex = this.xOffsets.length - 1;
			} else {
            	var elapsedMs = now - this.startTime;
            	frameIndex = Math.floor(elapsedMs * this.frameFactor % this.frameCount);
			}
			if (!this.loop && frameIndex === this.xOffsets.length - 1) {
				this.reachedEnd = true;
			}

			const ctx = renderContext.getCanvasContext();
			this.filterManager.applyFilters(ctx, () => {
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
			});
		}
	}
}
