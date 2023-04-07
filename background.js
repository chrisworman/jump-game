import { Sprite } from "./sprite.js";

export class Background {
    constructor(bgColor) {
        this.bgColor = bgColor;
        this.sprite = new Sprite('pixel-bg-2.png');
    }

    render(renderContext) {
        this.sprite.render(renderContext, 0, 0);
    }
}
