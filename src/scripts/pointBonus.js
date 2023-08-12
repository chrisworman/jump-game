import { Entity } from './entity.js';
import { FilterManager } from './filterManager.js';
import { Mover } from './mover.js';

export class PointBonus extends Entity {
    static FLOAT_UP_SPEED = -1;

    constructor(game, x, y, points) {
        super(game, x, y, 0, 0);

        this.points = points;

        // Fade out
        this.filterManager = new FilterManager();
        this.filterManager.animate(FilterManager.fadeOutAnimation(), game.gameTime, 1200);

        // Float up
        this.mover = new Mover(game, this);
        this.mover.setCollideWith({
            platforms: false,
            ceiling: false,
            walls: false,
        });
        this.mover.setVelocityY(PointBonus.FLOAT_UP_SPEED);
        this.mover.setVelocityX(0);
    }

    update() {
        super.update();
        this.mover.update();
        if (this.filterManager.animation == null) {
            // Done fading out
            this.game.overlayEntities = this.game.overlayEntities.filter((x) => x !== this);
            return;
        }
    }

    render(renderContext) {
        const ctx = renderContext.getCanvasContext();
        this.filterManager.applyFilters(this.game, ctx, () => {
            ctx.font = "45px 'VT323', monospace";
            ctx.fillStyle = 'white';
            ctx.fillText(this.points, this.x, this.y);
        });
    }
}
