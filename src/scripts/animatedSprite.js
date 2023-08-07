import { FilterManager } from './filterManager.js';

export class AnimatedSprite {
    constructor(imagePath, width, height, yOffset, frameCount, fps = 12, loop = true, xoffset = 0) {
        // By convention, sprite sheets for animations are always left to right horizontal
        this.imagePath = imagePath;
        this.xOffsets = Array(frameCount);
        this.yOffset = yOffset;
        for (let i = 0; i < frameCount; i++) {
            this.xOffsets[i] = i * width + xoffset;
        }
        this.frameCount = frameCount;
        this.startTime = -1;
        this.loop = loop;
        this.reachedEnd = false;
        this.onReachedEnd = null;
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
        this.onReachedEnd = null;
    }

    sync(other) {
        this.startTime = other.startTime;
    }

    setOnReachedEnd(onReachedEnd) {
        this.onReachedEnd = onReachedEnd;
    }

    render(renderContext, x, y) {
        if (this.loaded) {
            // Capture start time
            if (this.startTime === -1) {
                this.startTime = renderContext.game.gameTime;
            }

            // Get the next frame index, considering looping
            var frameIndex = 0;
            if (!this.loop && this.reachedEnd) {
                frameIndex = this.xOffsets.length - 1;
            } else {
                var elapsedMs = renderContext.game.gameTime - this.startTime;
                frameIndex = Math.floor((elapsedMs * this.frameFactor) % this.frameCount);
            }
            if (!this.loop && frameIndex === this.xOffsets.length - 1) {
                this.reachedEnd = true;
                if (this.onReachedEnd) {
                    this.onReachedEnd();
                }
            }

            const ctx = renderContext.getCanvasContext();
            this.filterManager.applyFilters(renderContext.game, ctx, () => {
                renderContext
                    .getCanvasContext()
                    .drawImage(
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

    pushHtml(html) {
        const id = Array.from(this.imagePath.matchAll(/^.*\/(.+)\..+$/g))[0][1];
        const animation = `sprite-animation-${id}`;
        const cssClass = `sprite-${id}`;
        html.push(`
            <style>
                @keyframes ${animation} {
                    to { background-position: -${this.width * this.frameCount}px; }
                }
          
                .${cssClass} {
                    width: ${this.width}px;
                    height: ${this.height}px;
                    background: url("${this.imagePath}");
                    animation: ${animation} ${this.frameCount / this.fps}s steps(${this.frameCount}) infinite;
                    overflow: hidden;
                    margin: 10px auto;
                }
            </style>
            <div class="${cssClass}"></div>
        `);
    }
}
