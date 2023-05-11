export class RenderContext {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext('2d');
        this.startTime = performance.now();
    }

    getCanvasContext() {
        return this.canvasContext;
    }

    getElapsedTime() {
        return performance.now() - this.startTime;
    }
}
