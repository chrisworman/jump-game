export class RenderContext {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext("2d");
        this.startTime = Date.now();
    }

    getCanvasContext() {
        return this.canvasContext;
    }

    getElapsedTime() {
        return Date.now() - this.startTime;
    }
}
