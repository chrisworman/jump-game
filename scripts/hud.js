import { Game } from './game.js';
import { Player } from './player.js';

export class Hud {
    constructor(game) {
        this.game = game;
        this.hearts = document.getElementById('hearts');
        this.textOverlay = document.getElementById('textOverlay');
        this.collectable = document.getElementById('collectable');
        this.collectableCount = document.getElementById('collectableCount');
        this.restartButton = document.getElementById('restartButton');
        this.restartButton.addEventListener('click', () => {
            game.startNewGame();
        });
        this.startButton = document.getElementById('startButton');
        this.startButton.addEventListener('click', () => {
            $(this.startButton).fadeOut('slow');
            game.startNewGame();
        });
        this.audioButton = document.getElementById('audioButton');
        this.audioButton.addEventListener('click', () => {
            game.toggleAudioMute();
        });

        this.displayCollectableCount(0);
        this.displayHealth(Game.MAX_PLAYER_HEALTH);
    }

    displayHealth(health) {
        const heartsHtmlBuffer = [];
        for (let i = 0; i < health; i++) {
            if (i === health - 1) {
                heartsHtmlBuffer.push('<div class="heart pulse-bg"></div>');
            } else {
                heartsHtmlBuffer.push('<div class="heart"></div>');
            }
        }
        for (let i = 0; i < Game.MAX_PLAYER_HEALTH - health; i++) {
            heartsHtmlBuffer.push('<div class="heart-empty"></div>');
        }
        this.hearts.innerHTML = heartsHtmlBuffer.join('');
    }

    displayCollectableCount(count) {
        if (count === 0) {
            this.collectable.classList.remove('pulse-bg');
            this.collectable.offsetHeight; // Force DOM reflow
            this.collectable.classList.add('pulse-bg');
        }
        this.collectableCount.innerText = String(count).padStart(2, '0');
    }

    displayAudioMuted(isMuted) {
        this.audioButton.style.backgroundPosition = isMuted ? '0px -32px' : '0px 0px';
    }

    textOverlayFadeIn(text) {
        this.textOverlay.innerText = text;
        $(this.textOverlay).fadeIn('slow');
    }

    textOverlayFadeOut(text) {
        if (text) {
            this.textOverlay.innerText = text;
        }
        setTimeout(() => {
            $(this.textOverlay).fadeOut('slow');
        }, 2000);
    }

    showStartButton() {
        $(this.startButton).fadeIn('slow');
    }

    hideStartButton() {
        $(this.startButton).fadeOut('slow');
    }

    showRestartButton() {
        $(this.restartButton).fadeIn('slow');
    }

    hideRestartButton() {
        $(this.restartButton).fadeOut('slow');
    }
}
