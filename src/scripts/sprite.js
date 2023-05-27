import { FilterManager } from './filterManager.js';

export class Sprite {
    constructor(imagePath, x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.loaded = false;
        this.image = new Image();
        this.image.addEventListener('load', () => {
            this.loaded = true;
            if (this.width === 0) {
                this.width = this.image.width;
                this.height = this.image.height;
            }
        });
        this.image.src = imagePath;
        this.filterManager = new FilterManager();
    }

    render(renderContext, x, y) {
        if (this.loaded) {
            const ctx = renderContext.getCanvasContext();
            this.filterManager.applyFilters(renderContext.game, ctx, () => {
                ctx.drawImage(
                    this.image,
                    this.x,
                    this.y,
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

    reset() {
    }
}
