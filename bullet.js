import { Sprite } from "./sprite.js";

export class Bullet {
    static WIDTH = 24;
	static HEIGHT = 12;
    static SPEED = 8;

	constructor(x, y, sprite, speed) {
		this.x = x;
		this.y = y;
		this.width = Bullet.WIDTH;
		this.height = Bullet.HEIGHT;
		this.sprite = sprite;
		this.speed = speed;
	}

	static spawn(player) {
		return new Bullet(
			player.x + (player.facingRight ? player.width - 15 : 15),
			player.y + (player.width / 2) - (Bullet.WIDTH / 2),
			new Sprite("bullet.png"),
            player.facingRight ? Bullet.SPEED : -Bullet.SPEED,
		);
	}

	render(renderContext) {
		this.sprite.render(renderContext, this.x, this.y);
	}

	update(onOffscreen) {
		this.x += this.speed;
		if (this.x > 550 || this.x + this.width < 0) {
			onOffscreen(this);
		}
	}
}
