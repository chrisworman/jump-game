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
    }

    animate(onUpdate, lengthMs = 1000) {
        this.animation = {
            startTime: performance.now(),
            onUpdate,
            lengthMs,
        };
    }

    applyFilters(ctx, render) {
        if (this.animation) {
            const elapsed = performance.now() - this.animation.startTime;
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
            this.saturatePercent !== 100;
        if (hasFilters) {
            ctx.save();
            // https://developer.mozilla.org/en-US/docs/Web/CSS/filter
            const hueRotate = this.hueDegrees > 0 ? `hue-rotate(${this.hueDegrees}deg) ` : '';
            const invert = this.invertPercent > 0 ? `invert(${this.invertPercent}%) ` : '';
            const opacity = this.opacityPercent < 100 ? `opacity(${this.opacityPercent}%) ` : '';
            const blur = this.blurPixels > 0 ? `blur(${this.blurPixels}px) ` : '';
            const brightness =
                this.brightnessPercent !== 100 ? `brightness(${this.brightnessPercent}%) ` : '';
            const saturation =
                this.saturatePercent !== 100 ? `saturate(${this.saturatePercent}%) ` : '';
            ctx.filter = `${hueRotate}${invert}${opacity}${blur}${brightness}${saturation}`;
        }

        render();

        if (hasFilters) {
            ctx.restore();
        }
    }

    static blurFadeOutAnimation() {
        return (fm, amountDone) => {
            fm.blurPixels = 5 * amountDone;
            fm.opacityPercent = 100 - 100 * amountDone;
        };
    }

    static recoveringAnimation() {
        return (fm, amountDone) => {
            // fm.hueDegrees = 110;
            fm.invertPercent = 100;
            fm.opacityPercent = ((Math.sin(amountDone * 15 * Math.PI) + 1) / 2.0) * 80 + 20;
        };
    }
}
