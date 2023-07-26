import { AnimatedSprite } from './animatedSprite.js';
import { Sprite } from './sprite.js';

export class SpriteLibrary {
    static SIZES = {
        PLAYER: {
            width: 64,
            height: 48,
        },
        SHIELD: {
            width: 76,
            height: 76,
        },
        FIRE_BALL: {
            width: 48,
            height: 48,
        },
        TURRET: {
            width: 64,
            height: 64,
        },
        GEM: {
            width: 48,
            height: 48,
        },
        LASER_COLLECTABLE: {
            width: 48,
            height: 24,
        },
        WALKER: {
            width: 24,
            height: 63,
        },
        TANK: {
            width: 64,
            height: 32,
        },
        TOWER: {
            width: 32,
            height: 64,
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
        BOSS_2: {
            width: 76,
            height: 64,
        },
        HEALTH_UP_HEART: {
            width: 32,
            height: 32,
        },
        BACKGROUND: {
            width: 550,
            height: 1600,
        },
        LASER_BEAM: {
            width: 550,
            height: 8,
        },
        HEAVY: {
            width: 76,
            height: 48,
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

    static shield() {
        return new Sprite(
            'images/shield-2.png',
            0,
            0,
            SpriteLibrary.SIZES.SHIELD.width,
            SpriteLibrary.SIZES.SHIELD.height
        );
    }

    static laserCollectable() {
        return new AnimatedSprite(
            'images/laser-collectable.png',
            SpriteLibrary.SIZES.LASER_COLLECTABLE.width,
            SpriteLibrary.SIZES.LASER_COLLECTABLE.height,
            0,
            4,
            6,
            true
        );
    }

    static laserBeam() {
        return new Sprite(
            'images/laser-beam.png',
            0,
            0,
            SpriteLibrary.SIZES.LASER_BEAM.width,
            SpriteLibrary.SIZES.LASER_BEAM.height
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

    static gem() {
        return new AnimatedSprite(
            'images/red-gem-48-48.png',
            SpriteLibrary.SIZES.GEM.width,
            SpriteLibrary.SIZES.GEM.height,
            0,
            22,
            12
        );
    }

    static turretIdle() {
        return new AnimatedSprite(
            'images/turret.png',
            SpriteLibrary.SIZES.TURRET.width,
            SpriteLibrary.SIZES.TURRET.height,
            0,
            2,
            3,
            true
        );
    }

    static turretFiring() {
        return new AnimatedSprite(
            'images/turret.png',
            SpriteLibrary.SIZES.TURRET.width,
            SpriteLibrary.SIZES.TURRET.height,
            0,
            6,
            36,
            false
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

    static platform7() {
        return new Sprite('images/platform-7.png');
    }

    static walkerWalking() {
        return new AnimatedSprite(
            'images/walker.png',
            SpriteLibrary.SIZES.WALKER.width,
            SpriteLibrary.SIZES.WALKER.height,
            0,
            2,
            3
        );
    }

    static walkerDying() {
        return new AnimatedSprite(
            'images/walker.png',
            SpriteLibrary.SIZES.WALKER.width,
            SpriteLibrary.SIZES.WALKER.height,
            0,
            10,
            9,
            false
        );
    }

    static tankLeft() {
        return new AnimatedSprite(
            'images/tank-left.png',
            SpriteLibrary.SIZES.TANK.width,
            SpriteLibrary.SIZES.TANK.height,
            0,
            5,
            12,
            false
        );
    }

    static tankRight() {
        return new AnimatedSprite(
            'images/tank-right.png',
            SpriteLibrary.SIZES.TANK.width,
            SpriteLibrary.SIZES.TANK.height,
            0,
            5,
            12,
            false
        );
    }

    static heavyIdle() {
        return new AnimatedSprite(
            'images/heavy.png',
            SpriteLibrary.SIZES.HEAVY.width,
            SpriteLibrary.SIZES.HEAVY.height,
            0,
            3,
            3,
            true
        );
    }

    static tankIdle() {
        return new Sprite(
            'images/tank-bombing.png',
            0,
            0,
            SpriteLibrary.SIZES.TANK.width,
            SpriteLibrary.SIZES.TANK.height
        );
    }

    static tankBombing() {
        return new AnimatedSprite(
            'images/tank-bombing.png',
            SpriteLibrary.SIZES.TANK.width,
            SpriteLibrary.SIZES.TANK.height,
            0,
            4,
            18,
            false
        );
    }

    static towerLeftIdle() {
        return new AnimatedSprite(
            'images/tower-left.png',
            SpriteLibrary.SIZES.TOWER.width,
            SpriteLibrary.SIZES.TOWER.height,
            0,
            2,
            1,
            true
        );
    }

    static towerLeftShoot() {
        return new AnimatedSprite(
            'images/tower-left.png',
            SpriteLibrary.SIZES.TOWER.width,
            SpriteLibrary.SIZES.TOWER.height,
            0,
            4,
            12,
            false
        );
    }

    static towerRightIdle() {
        return new AnimatedSprite(
            'images/tower-right.png',
            SpriteLibrary.SIZES.TOWER.width,
            SpriteLibrary.SIZES.TOWER.height,
            0,
            2,
            1,
            true
        );
    }

    static towerRightShoot() {
        return new AnimatedSprite(
            'images/tower-right.png',
            SpriteLibrary.SIZES.TOWER.width,
            SpriteLibrary.SIZES.TOWER.height,
            0,
            4,
            12,
            false
        );
    }

    static bullet() {
        return new Sprite(
            'images/game-sprites.png',
            0,
            0,
            SpriteLibrary.SIZES.BULLET.width,
            SpriteLibrary.SIZES.BULLET.height
        );
    }

    static bomb() {
        return new AnimatedSprite(
            'images/bomb-2.png',
            SpriteLibrary.SIZES.BOMB.width,
            SpriteLibrary.SIZES.BOMB.height,
            0,
            4,
            12,
            true
        );
    }

    static bossIdle() {
        return new AnimatedSprite(
            'images/boss-1.png',
            SpriteLibrary.SIZES.BOSS.width,
            SpriteLibrary.SIZES.BOSS.height,
            0,
            5,
            10,
            false
        );
    }

    static bossJump() {
        return new AnimatedSprite(
            'images/boss-1.png',
            SpriteLibrary.SIZES.BOSS.width,
            SpriteLibrary.SIZES.BOSS.height,
            0,
            5,
            10,
            false
        );
    }

    static boss2Pace() {
        return new AnimatedSprite(
            'images/boss-2.png',
            SpriteLibrary.SIZES.BOSS_2.width,
            SpriteLibrary.SIZES.BOSS_2.height,
            0,
            8,
            10,
            true
        );
    }

    static boss2Shoot() {
        return new AnimatedSprite(
            'images/boss-2.png',
            SpriteLibrary.SIZES.BOSS_2.width,
            SpriteLibrary.SIZES.BOSS_2.height,
            0,
            1,
            0,
            false,
            SpriteLibrary.SIZES.BOSS_2.width * 3
        );
    }

    static bossBomb() {
        return new AnimatedSprite(
            'images/boss-1.png',
            SpriteLibrary.SIZES.BOSS.width,
            SpriteLibrary.SIZES.BOSS.height,
            0,
            5,
            30,
            false
        );
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

    static healthUpHeart() {
        return new Sprite('images/heart.png');
    }
}
