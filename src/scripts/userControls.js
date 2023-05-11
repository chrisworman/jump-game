export class UserControls {
    constructor(game) {
        this.left = false;
        this.right = false;
        this.jump = false;
        this.drop = false;
        this.shoot = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        if (event.code === 'ArrowLeft') {
            this.left = true;
        } else if (event.code === 'ArrowRight') {
            this.right = true;
        } else if (event.code === 'ArrowUp') {
            this.jump = true;
        } else if (event.code === 'ArrowDown') {
            this.drop = true;
        } else if (event.code === 'Space') {
            this.shoot = true;
        }
    }

    handleKeyUp(event) {
        if (event.code === 'ArrowLeft') {
            this.left = false;
        } else if (event.code === 'ArrowRight') {
            this.right = false;
        } else if (event.code === 'ArrowUp') {
            this.jump = false;
        } else if (event.code === 'ArrowDown') {
            this.drop = false;
        } else if (event.code === 'Space') {
            this.shoot = false;
        }
    }
}
