import { Game } from './game.js';

export class Hud {
    constructor(game) {
        this.game = game;
        this.hearts = document.getElementById('hearts');
        this.textOverlay = document.getElementById('textOverlay');
        this.score = document.getElementById('score');
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

        this.displayScore(0);
        this.displayHealth(Game.MAX_PLAYER_HEALTH);
    }

    displayHealth(health) {
        const heartsHtmlBuffer = [];
        for (let i = 0; i < health; i++) {
            heartsHtmlBuffer.push('<div class="heart"></div>');
        }
        for (let i = 0; i < Game.MAX_PLAYER_HEALTH - health; i++) {
            heartsHtmlBuffer.push('<div class="heart-empty"></div>');
        }
        this.hearts.innerHTML = heartsHtmlBuffer.join('');
    }

    displayScore(score) {
        this.score.innerText = String(score).padStart(6, '0');
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
