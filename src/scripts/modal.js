import { LeaderBoard } from './leaderBoard.js';

export class Modal {
    constructor(game) {
        this.game = game;
        this.element = document.getElementById('modal');
        this.title = document.getElementById('modalTitle');
        this.manual = document.getElementById('modalManual');
        this.input = document.getElementById('modalInput');
        this.tabs = document.getElementById('modalTabs');
        this.stats = document.getElementById('modalStats');
        this.leaderBoard = document.getElementById('modalLeaderBoard');
        this.button = document.getElementById('modalButton');
        
        // Button events
        this.button.addEventListener('click', () => {
            this.handleAction();
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Enter') {
                this.handleAction();
            }
        });

        // Tab events
        document.querySelectorAll('.tab, .tab-selected').forEach((tab) => {
            tab.addEventListener('click', () => {
                // Selected tab
                document.querySelectorAll('.tab-selected').forEach((selectedTab) => {
                    selectedTab.className = 'tab';
                });
                tab.className = 'tab-selected';
                // Content
                document.querySelectorAll('.tab-content').forEach((tabContent) => {
                    if (tabContent.dataset.tabId === tab.dataset.tabId) {
                        tabContent.style.display = 'block';
                    } else {
                        tabContent.style.display = 'none';
                    }
                });
            });
        });
    }

    showManual(text, buttonText, onAction) {
        this.title.innerText = text;
        this.button.innerText = `${buttonText} ⏎`;
        this.onAction = onAction;
        this.hideAllContent();
        $(this.manual).show();
        $(this.element).fadeIn('slow');
    }

    showNewLeaderBoardRecord(points, didBeatGame = false) {
        this.hideAllContent();
        this.stats.style.backgroundImage = `url("images/level-${this.game.level.world.number}-bg-layer-0-fuzzy.png")`;
        this.title.innerText = didBeatGame ? 'Game Complete' : 'New High Score';
        this.input.placeholder = 'Enter your name';
        $(this.input).show();
        this.input.focus();
        this.button.innerText = `CONTINUE ⏎`;
        this.onAction = () => {
            const name = this.input.value;
            if (name) {
                LeaderBoard.add(points, name);
                this.showTabs(didBeatGame ? 'Game Complete' :'Pixel Jump', 'Play Again', () => {
                    if (didBeatGame) {
                        this.game.songHandler.stop(); // Finale song
                    }
                    this.game.startNewGame();
                });
            }
            return true; // cancel fadeout
        };
        $(this.element).fadeIn('slow');
    }

    showTabs(title, buttonText, onAction) {
        this.hideAllContent();
        this.title.innerText = title;
        this.button.innerText = `${buttonText} ⏎`;
        this.onAction = onAction;

        const bgStyle = `url("images/level-${this.game.level?.world?.number || 1}-bg-layer-0-fuzzy.png")`;
        document.querySelectorAll('.tab-content').forEach((tabContent) => {
            tabContent.style.backgroundImage = bgStyle;
        });
        
        this.stats.innerHTML = this.game.stats.getWorldHtml();
        this.leaderBoard.innerHTML = LeaderBoard.getHtml();

        $(this.tabs).show();
        $(this.element).fadeIn('slow');
    }

    hideAllContent() {
        $(this.input).hide();
        $(this.manual).hide();
        $(this.tabs).hide();
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
