export class Sprite {
	constructor(imagePath, x = 0, y = 0, width = 0, height = 0) {
		this.x = x;
		this.y = y;
		this.opacity = 1.0;
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
	}

	render(renderContext, x, y) {
		if (this.loaded) {
			let ctx = renderContext.getCanvasContext();
			ctx.save();
			ctx.globalAlpha = this.opacity;
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
			ctx.restore();
		}
	}
}
