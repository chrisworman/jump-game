import { AnimatedSprite } from "./animatedSprite.js";
import { Sprite } from "./sprite.js";

export class SpriteLibrary {
	static SIZES = {
		PLAYER: {
			width: 64,
			height: 48,
		},
		FIRE_BALL: {
			width: 48,
			height: 48,
		},
		COLLECTABLE: {
			width: 48,
			height: 48,
		},
		WALKER: {
			width: 24,
			height: 63,
		},
		BULLET: {
			width: 24,
			height: 12,
		},
	};

	static preloadImages() {
		console.log('SpriteLibrary :: preloadImages()');
		Object.getOwnPropertyNames(SpriteLibrary)
			.filter((propName) => propName !== "preloadImages")
			.filter((propName) => typeof SpriteLibrary[propName] === "function")
			.forEach((methodName) => {
				console.log(`SpriteLibrary :: preloadImages.${methodName}()`);
				SpriteLibrary[methodName]();
			});
	}

	static playerStandingLeft() {
		return new AnimatedSprite(
			"images/blob-facing-left.png",
			SpriteLibrary.SIZES.PLAYER.width,
			SpriteLibrary.SIZES.PLAYER.height,
			0,
			2,
			1
		);
	}

	static playerStandingRight() {
		return new AnimatedSprite(
			"images/blob-facing-right.png",
			SpriteLibrary.SIZES.PLAYER.width,
			SpriteLibrary.SIZES.PLAYER.height,
			0,
			2,
			1
		);
	}

	static playerJumpingLeft() {
		return new AnimatedSprite(
			"images/blob-facing-left.png",
			SpriteLibrary.SIZES.PLAYER.width,
			SpriteLibrary.SIZES.PLAYER.height,
			0,
			6,
			14,
			false
		);
	}

	static playerJumpingRight() {
		return new AnimatedSprite(
			"images/blob-facing-right.png",
			SpriteLibrary.SIZES.PLAYER.width,
			SpriteLibrary.SIZES.PLAYER.height,
			0,
			6,
			14,
			false
		);
	}

	static fireBall() {
		return new AnimatedSprite(
			"images/fire-ball.png",
			SpriteLibrary.SIZES.FIRE_BALL.width,
			SpriteLibrary.SIZES.FIRE_BALL.height,
			0,
			5,
			8
		);
	}

	static collectable() {
		return new AnimatedSprite(
			"images/red-gem-48-48.png",
			SpriteLibrary.SIZES.COLLECTABLE.width,
			SpriteLibrary.SIZES.COLLECTABLE.height,
			0,
			22,
			12
		);
	}

	static groundGreen() {
		return new Sprite("images/ground.png");
	}

	static groundPurple() {
		return new Sprite("images/ground-2.png");
	}

	static walkerWalking() {
		return new AnimatedSprite(
			"images/cubes.png",
			SpriteLibrary.SIZES.WALKER.width,
			SpriteLibrary.SIZES.WALKER.height,
			0,
			2,
			3
		);
	}

	static walkerDying() {
		return new AnimatedSprite(
			"images/cubes.png",
			SpriteLibrary.SIZES.WALKER.width,
			SpriteLibrary.SIZES.WALKER.height,
			0,
			10,
			9,
			false
		);
	}

	static bullet() {
		return new Sprite("images/bullet.png");
	}
}
