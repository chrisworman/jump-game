export class Modal {
    constructor() {
        this.element = document.getElementById('modal');
        this.text = document.getElementById('modalText');
        this.button = document.getElementById('modalButton');
        this.button.addEventListener('click', () => {
            this.handleAction();
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Enter') {
                this.handleAction();
            }
        });
    }

    show(text, buttonText, onAction) {
        this.text.innerText = text;
        this.button.innerText = buttonText;
        this.onAction = onAction;
        $(this.element).fadeIn('slow');
    }

    handleAction() {
        if (this.onAction) {
            $(this.element).fadeOut('slow');
            this.onAction();
            this.onAction = null;
        }
    }
}
