export class UserControls {
    constructor(game) {
        this.left = false;
        this.right = false;
        this.jump = false;
        this.drop = false;
        this.shoot = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        const osLeft = document.querySelector('#osLeft');
        const osRight = document.querySelector('#osRight');
        const osDown = document.querySelector('#osDown');
        const osShoot = document.querySelector('#osShoot');
        const osJump = document.querySelector('#osJump');

        osLeft.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.left = true;
        });
        osLeft.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.left = false;
        });

        osRight.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.right = true;
        });
        osRight.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.right = false;
        });

        osDown.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.drop = true;
        });
        osDown.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.drop = false;
        });

        osShoot.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.shoot = true;
        });
        osShoot.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.shoot = false;
        });

        osJump.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.jump = true;
        });
        osJump.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.jump = false;
        });
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
