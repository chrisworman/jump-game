export class UserControls {
	constructor() {
		this.left = false;
		this.right = false;
		this.jump = false;
		// this.restartHandler = restartHandler;
	}

	enable() {
		document.addEventListener("keydown", this.#handleKeyDown.bind(this));
		document.addEventListener("keyup", this.#handleKeyUp.bind(this));
		// document.getElementById('restartButton').addEventListener(
		// 	'click',
		// 	() => { this.restartHandler(); },
		// );
	}

	#handleKeyDown(event) {
		if (event.code === "ArrowLeft") {
			this.left = true;
		} else if (event.code === "ArrowRight") {
			this.right = true;
		} else if (event.code === "Space" || event.code === "ArrowUp") {
			this.jump = true;
		}
	}

	#handleKeyUp(event) {
		if (event.code === "ArrowLeft") {
			this.left = false;
		} else if (event.code === "ArrowRight") {
			this.right = false;
		} else if (event.code === "Space" || event.code === "ArrowUp") {
			this.jump = false;
		}
	}
}
