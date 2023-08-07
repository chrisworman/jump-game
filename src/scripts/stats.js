import { EnemyTypes } from './enemyTypes.js';
import { LevelManager } from './levelManager.js';
import { SpriteLibrary } from './spriteLibrary.js';

export class Stats {
    constructor(game) {
        this.game = game;
        this.world = {};
        for (let i = 1; i <= LevelManager.WORLD_COUNT; i++) {
            this.world[i] = {
                gems: {
                    collected: 0,
                    available: 0,
                },
                enemies: {
                    killedByType: {},
                    availableByType: {},
                },
            };
        }
    }

    gemsAvailable(availableCount) {
        const worldNumber = this.game.level.world.number;
        this.world[worldNumber].gems.available += availableCount;
    }

    gemCollected() {
        const worldNumber = this.game.level.world.number;
        this.world[worldNumber].gems.collected++;
    }

    shootableEnemyAvailable(enemyType) {
        const worldNumber = this.game.level.world.number;
        const prev = this.world[worldNumber].enemies.availableByType[enemyType] || 0;
        this.world[worldNumber].enemies.availableByType[enemyType] = prev + 1;
    }

    enemyKilled(enemyType) {
        const worldNumber = this.game.level.world.number;
        const prev = this.world[worldNumber].enemies.killedByType[enemyType] || 0;
        this.world[worldNumber].enemies.killedByType[enemyType] = prev + 1;
    }

    getWorldHtml() {
        const html = [];
        const worldNumber = this.game.level.world.number;
        const w = this.world[worldNumber];
        

        const collected = w.gems.collected;
        const available = w.gems.available;
        const percent = `${Math.ceil((collected / available) * 100)}%`;
        html.push('<div class="modal-stat-row">');
        SpriteLibrary.gem().pushHtml(html);
        html.push(`<div class="modal-stat-text">${collected} / ${available} ≈ ${percent}</div>`);
        html.push('</div>');

        const enemiesKilled = w.enemies.killedByType;
        const enemiesAvailable = w.enemies.availableByType;
        let totalAvailable = 0;
        let totalKilled = 0;
        for (const type in enemiesAvailable) {
            const available = enemiesAvailable[type];
            const killed = enemiesKilled[type] || 0;
            totalAvailable += available;
            totalKilled += killed;
            this.pushEnemyKilledHtml(html, type, killed, available);
        }

        return html.join('');
    }

    getGameHtml() {
        const html = [];
        // TODO: aggregate stats over all worlds
        return html.join('');
    }

    pushEnemyKilledHtml(html, type, killed, available) {
        const percent = `${Math.ceil((killed / available) * 100)}%`;
        html.push('<div class="modal-stat-row">');
        this.pushEnemySpriteHtml(html, type);
        html.push(`<div class="modal-stat-text">${killed} / ${available} ≈ ${percent}</div>`);
        html.push('</div>');
    }

    pushEnemySpriteHtml(html, type) {
        switch (type) {
            case EnemyTypes.WALKER:
                SpriteLibrary.walkerWalking().pushHtml(html);
                break;
            case EnemyTypes.TOWER:
                SpriteLibrary.towerRightIdle().pushHtml(html);
                break;
            case EnemyTypes.DUMPER:
                SpriteLibrary.dumperIdle().pushHtml(html);
                break;
            case EnemyTypes.TANK:
                SpriteLibrary.tankBombing().pushHtml(html);
                break;
            case EnemyTypes.SENTRY:
                SpriteLibrary.sentryIdle().pushHtml(html);
                break;
            case EnemyTypes.POUNDER:
                SpriteLibrary.pounderIdle().pushHtml(html);
                break;
            case EnemyTypes.ZAMBONEY:
                SpriteLibrary.zamboneyRight().pushHtml(html);
                break;
            case EnemyTypes.POPPER:
                SpriteLibrary.popperIdle().pushHtml(html);
                break;
            case EnemyTypes.BOMBER:
                SpriteLibrary.bomberShoot().pushHtml(html);
                break;
            case EnemyTypes.CHASER:
                SpriteLibrary.chaserRight().pushHtml(html);
                break;
            case EnemyTypes.TURRET:
                SpriteLibrary.turretIdle().pushHtml(html);
                break;
            case EnemyTypes.HEAVY:
                SpriteLibrary.heavyIdle().pushHtml(html);
                break;
        }
    }
}
