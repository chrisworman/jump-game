import { Game } from './game.js';

export class Hud {
    constructor(game) {
        this.game = game;
        this.hearts = document.getElementById('hearts');
        this.shield = document.getElementById('shield');
        this.collectable = document.getElementById('collectable');
        this.hudText = document.getElementById('hudText');
        this.collectableCount = document.getElementById('collectableCount');
        this.audioButton = document.getElementById('audioButton');
        this.audioButton.addEventListener('click', () => {
            game.toggleAudioMute();
        });

        this.displayGemCount(0);
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

    displayGemCount(count) {
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

    displayShield(timeLeft) {
        this.shield.className = timeLeft ? 'shield' : 'shield-empty';
        this.shield.innerText = timeLeft ? timeLeft : '';
    }

    displayLevel(level) {
        if (level.boss) {
            this.hudText.innerText = `World ${level.world.number} Boss`;
        } else {
            const paddedLevel = level.number.toString().padStart(2, '0');
            this.hudText.innerText = `World ${level.world.number} Level ${paddedLevel}`;
        }
    }
}
