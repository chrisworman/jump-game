export class RenderContext {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.canvasContext = game.canvas.getContext('2d');
        this.startTime = game.gameTime;
    }

    getCanvasContext() {
        return this.canvasContext;
    }

    getElapsedTime() {
        return this.game.gameTime - this.startTime;
    }
}
