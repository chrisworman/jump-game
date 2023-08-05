export class FilterManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.hueDegrees = 0; // 0-360
        this.invertPercent = 0; // 0-100
        this.opacityPercent = 100; // 0-100
        this.brightnessPercent = 100; // 0-100-?
        this.blurPixels = 0; // 0-?
        this.saturatePercent = 100; // 0-100
        this.animation = null;
        this.dropShadow = null;
    }

    animate(onUpdate, now, lengthMs = 1000) {
        this.animation = {
            startTime: now,
            onUpdate,
            lengthMs,
        };
    }

    applyFilters(game, ctx, render) {
        if (this.animation) {
            const elapsed = game.gameTime - this.animation.startTime;
            const amountDone = Math.min(1.0, elapsed / this.animation.lengthMs);
            this.animation.onUpdate(this, amountDone);
            if (amountDone === 1.0) {
                this.animation = null;
            }
        }

        const hasFilters =
            this.hueDegrees > 0 ||
            this.invertPercent > 0 ||
            this.opacityPercent < 100 ||
            this.blurPixels > 0 ||
            this.brightnessPercent !== 100 ||
            this.saturatePercent !== 100 ||
            this.dropShadow !== null;
        if (hasFilters) {
            ctx.save();
            // https://developer.mozilla.org/en-US/docs/Web/CSS/filter
            const hueRotate = this.hueDegrees > 0 ? `hue-rotate(${this.hueDegrees}deg) ` : '';
            const invert = this.invertPercent > 0 ? `invert(${this.invertPercent}%) ` : '';
            const opacity = this.opacityPercent <= 100 ? `opacity(${this.opacityPercent}%) ` : '';
            const blur = this.blurPixels > 0 ? `blur(${this.blurPixels}px) ` : '';
            const brightness =
                this.brightnessPercent !== 100 ? `brightness(${this.brightnessPercent}%) ` : '';
            const saturation =
                this.saturatePercent !== 100 ? `saturate(${this.saturatePercent}%) ` : '';
            const shadow = this.dropShadow ? `drop-shadow(${this.dropShadow}) ` : ''
            ctx.filter = `${hueRotate}${invert}${opacity}${blur}${brightness}${saturation}`;
        }

        render();

        if (hasFilters) {
            ctx.restore();
        }
    }

    static fadeOutAnimation() {
        return (fm, amountDone) => {
            fm.opacityPercent = 100 - 100 * amountDone;
        };
    }

    static fadeInBrightnessAnimation() {
        return (fm, amountDone) => {
            fm.brightnessPercent = 100 * amountDone;
        };
    }

    static fadeOutBrightnessAnimation() {
        return (fm, amountDone) => {
            fm.brightnessPercent = 100 - 100 * amountDone;
        };
    }

    static fadeInAnimation() {
        return (fm, amountDone) => {
            fm.opacityPercent = 100 * amountDone;
        };
    }


    static fadeInAndOutAnimation() {
        return (fm, amountDone) => {
            fm.brightnessPercent = ((Math.sin(amountDone * 10 * Math.PI) + 1) / 2.0) * 60 + 90;
        };
    }

    static blurFadeOutAnimation() {
        return (fm, amountDone) => {
            fm.blurPixels = 5 * amountDone;
            fm.opacityPercent = 100 - 100 * amountDone;
        };
    }

    static recoveringAnimation() {
        return (fm, amountDone) => {
            fm.invertPercent = 100;
            fm.opacityPercent = ((Math.sin(amountDone * 15 * Math.PI) + 1) / 2.0) * 80 + 20;
        };
    }
}
