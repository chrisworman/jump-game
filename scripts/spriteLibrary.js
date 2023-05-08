import { AnimatedSprite } from './animatedSprite.js';
import { Sprite } from './sprite.js';

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
        BOMB: {
            width: 24,
            height: 24,
        },
        BOSS: {
            width: 64,
            height: 76,
        },
        BACKGROUND: {
            width: 550,
            height: 1600,
        },
    };

    static preloadImages() {
        console.log('SpriteLibrary :: preloadImages()');
        Object.getOwnPropertyNames(SpriteLibrary)
            .filter((propName) => propName !== 'preloadImages')
            .filter((propName) => typeof SpriteLibrary[propName] === 'function')
            .forEach((methodName) => {
                console.log(`SpriteLibrary :: preloadImages.${methodName}()`);
                SpriteLibrary[methodName]();
            });
    }

    static playerStandingLeft() {
        return new AnimatedSprite(
            'images/blob-facing-left.png',
            SpriteLibrary.SIZES.PLAYER.width,
            SpriteLibrary.SIZES.PLAYER.height,
            0,
            2,
            1
        );
    }

    static playerStandingRight() {
        return new AnimatedSprite(
            'images/blob-facing-right.png',
            SpriteLibrary.SIZES.PLAYER.width,
            SpriteLibrary.SIZES.PLAYER.height,
            0,
            2,
            1
        );
    }

    static playerJumpingLeft() {
        return new AnimatedSprite(
            'images/blob-facing-left.png',
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
            'images/blob-facing-right.png',
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
            'images/fire-ball.png',
            SpriteLibrary.SIZES.FIRE_BALL.width,
            SpriteLibrary.SIZES.FIRE_BALL.height,
            0,
            5,
            8
        );
    }

    static collectable() {
        return new AnimatedSprite(
            'images/red-gem-48-48.png',
            SpriteLibrary.SIZES.COLLECTABLE.width,
            SpriteLibrary.SIZES.COLLECTABLE.height,
            0,
            22,
            12
        );
    }

    static platform1() {
        return new Sprite('images/platform-1.png');
    }

    static platform2() {
        return new Sprite('images/platform-2.png');
    }

    static platform3() {
        return new Sprite('images/platform-3.png');
    }

    static platform4() {
        return new Sprite('images/platform-4.png');
    }

    static platform5() {
        return new Sprite('images/platform-5.png');
    }

    static platform6() {
        return new Sprite('images/platform-6.png');
    }

    static walkerWalking() {
        return new AnimatedSprite(
            'images/cubes.png',
            SpriteLibrary.SIZES.WALKER.width,
            SpriteLibrary.SIZES.WALKER.height,
            0,
            2,
            3
        );
    }

    static walkerDying() {
        return new AnimatedSprite(
            'images/cubes.png',
            SpriteLibrary.SIZES.WALKER.width,
            SpriteLibrary.SIZES.WALKER.height,
            0,
            10,
            9,
            false
        );
    }

    static bullet() {
        return new Sprite('images/bullet.png');
    }

    static bomb() {
        return new AnimatedSprite(
            'images/bomb.png',
            SpriteLibrary.SIZES.BOMB.width,
            SpriteLibrary.SIZES.BOMB.height,
            0,
            8,
            12,
            true
        );
    }

    static boss() {
        return new Sprite('images/boss-1.png');
    }

    static backgroundLayer0() {
        return new Sprite('images/bg-layer-0.png');
    }

    static backgroundLayer1() {
        return new Sprite('images/bg-layer-1.png');
    }

    static backgroundLayer2() {
        return new Sprite('images/bg-layer-2.png');
    }
}
