export class Modal {
    constructor(game) {
        this.game = game;
        this.element = document.getElementById('modal');
        this.manual = document.getElementById('modalManual');
        this.stats = document.getElementById('modalStats');
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
        this.stats.innerHTML = this.game.stats.getWorldHtml();
        this.stats.style.backgroundImage = `url("images/level-${this.game.level.world.number}-bg-layer-0-fuzzy.png")`;
        $(this.stats).show();
        $(this.element).fadeIn('slow');
    }

    showWorldComplete(text, buttonText, onAction) {
        this.text.innerText = text;
        this.button.innerText = `${buttonText} ⏎`;
        this.onAction = onAction;
        this.hideAllContent();
        this.stats.innerHTML = this.game.stats.getWorldHtml();
        this.stats.style.backgroundImage = `url("images/level-${this.game.level.world.number}-bg-layer-0-fuzzy.png")`;
        $(this.stats).show();
        $(this.element).fadeIn('slow');
    }

    hideAllContent() {
        $(this.manual).hide();
        $(this.stats).hide();
    }

    handleAction() {
        if (this.onAction) {
            $(this.element).fadeOut('slow');
            this.onAction();
            this.onAction = null;
        }
    }
}
