import { LeaderBoard } from "./leaderBoard.js";

export class Modal {
    constructor(game) {
        this.game = game;
        this.element = document.getElementById('modal');
        this.input = document.getElementById('modalInput');
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

    showNewLeaderBoardRecord(points) {
        this.hideAllContent();
        this.stats.style.backgroundImage = `url("images/level-${this.game.level.world.number}-bg-layer-0-fuzzy.png")`;
        this.text.innerText = 'You made the TOP TEN!';
        this.input.placeholder = 'Enter your name';
        this.input.focus();
        $(this.input).show();
        this.button.innerText = `CONTINUE ⏎`;
        this.onAction = () => {
            const name = this.input.value;
            if (name) {
                LeaderBoard.add(points, name);
                $(this.input).hide();
                this.stats.innerHTML = LeaderBoard.getHtml();
                $(this.stats).show();
                this.onAction = () => {
                    this.game.startNewGame();
                };
                this.button.innerText = `PLAY AGAIN ⏎`;
            }
            return true; // cancel fadeout
        };
        $(this.element).fadeIn('slow');
    }

    showEndGame(text, buttonText, onAction) {
        this.hideAllContent();
        this.text.innerText = text;
        this.button.innerText = `${buttonText} ⏎`;
        this.onAction = onAction;
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
        $(this.input).hide();
        $(this.manual).hide();
        $(this.stats).hide();
    }

    handleAction() {
        if (this.onAction) {
            const cancelFadeOut = this.onAction();
            if (!cancelFadeOut) {
                $(this.element).fadeOut('slow');
                this.onAction = null;
            }
        }
    }
}
