import { Sprite } from "./sprite.js";

export class Background {
    constructor(bgColor) {
        this.bgColor = bgColor;
        this.sprite = new Sprite('ground.png');
    }

    render(renderContext) {
        for (let y=0; y < 800; y += 100) {
            this.sprite.render(renderContext, 0, y);
        }
    }
}
