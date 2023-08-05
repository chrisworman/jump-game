export class Modal {
    constructor() {
        this.element = document.getElementById('modal');
        this.manual = document.getElementById('modalManual');
        this.text = document.getElementById('modalText');
        this.button = document.getElementById('modalButton');
        this.button.addEventListener('click', () => {
            this.handleAction();
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Enter' || event.code === 'Space') {
                this.handleAction();
            }
        });
    }

    showManual(text, buttonText, onAction) {
        this.text.innerText = text;
        this.button.innerText = `${buttonText} ⏎`;
        this.onAction = onAction;
        this.hideAllContent();
        $(this.manual).show();
        $(this.element).fadeIn('slow');
    }

    showEndGame(text, buttonText, onAction) {
        this.text.innerText = text;
        this.button.innerText = `${buttonText} ⏎`;
        this.onAction = onAction;
        this.hideAllContent();
        // TODO: show end game stats
        $(this.element).fadeIn('slow');
    }

    showWorldComplete(text, buttonText, onAction) {
        this.text.innerText = text;
        this.button.innerText = `${buttonText} ⏎`;
        this.onAction = onAction;
        this.hideAllContent();
        // TODO: show end world stats
        $(this.element).fadeIn('slow');
    }

    hideAllContent() {
        $(this.manual).hide();
    }

    handleAction() {
        if (this.onAction) {
            $(this.element).fadeOut('slow');
            this.onAction();
            this.onAction = null;
        }
    }
}
