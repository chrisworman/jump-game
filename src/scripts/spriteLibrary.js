import { AnimatedSprite } from './animatedSprite.js';
import { Sprite } from './sprite.js';

export class SpriteLibrary {
    static SIZES = {
        PLAYER: {
            width: 56,
            height: 48,
        },
        SHIELD: {
            width: 76,
            height: 76,
        },
        BIG_BOMB: {
            width: 36,
            height: 36,
        },
        POUNDER: {
            width: 32,
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
        ROCKET: {
            width: 24,
            height: 24,
        },
        BOSS_1: {
            width: 76,
            height: 64,
        },
        BOSS_2: {
            width: 64,
            height: 76,
        },
        BOSS_3: {
            width: 56,
            height: 56,
        },
        BOSS_4: {
            width: 76,
            height: 64,
        },
        BOSS_5: {
            width: 300,
            height: 300,
        },
        BOSS_5_JETS: {
            width: 300,
            height: 16,
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
        BOMBER: {
            width: 76,
            height: 36,
        },
        CHASER: {
            width: 32,
            height: 32,
        },
        SENTRY: {
            width: 32,
            height: 64,
        },
        DUMPER: {
            width: 32,
            height: 64,
        },
        POPPER: {
            width: 48,
            height: 64,
        },
        ZAMBONEY: {
            width: 64,
            height: 64,
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

    static bigBomb() {
        return new AnimatedSprite(
            'images/big-bomb.png',
            SpriteLibrary.SIZES.BIG_BOMB.width,
            SpriteLibrary.SIZES.BIG_BOMB.height,
            0,
            4,
            12,
            true
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

    static popperIdle() {
        return new AnimatedSprite(
            'images/popper.png',
            SpriteLibrary.SIZES.POPPER.width,
            SpriteLibrary.SIZES.POPPER.height,
            0,
            8,
            6,
            true
        );
    }

    static popperShoot() {
        return new AnimatedSprite(
            'images/popper.png',
            SpriteLibrary.SIZES.POPPER.width,
            SpriteLibrary.SIZES.POPPER.height,
            0,
            2,
            14,
            false,
            SpriteLibrary.SIZES.POPPER.width * 8
        );
    }

    static zamboneyRight() {
        return new AnimatedSprite(
            'images/zamboney.png',
            SpriteLibrary.SIZES.ZAMBONEY.width,
            SpriteLibrary.SIZES.ZAMBONEY.height,
            0,
            3,
            6,
            true
        );
    }

    static zamboneyLeft() {
        return new AnimatedSprite(
            'images/zamboney.png',
            SpriteLibrary.SIZES.ZAMBONEY.width,
            SpriteLibrary.SIZES.ZAMBONEY.height,
            0,
            3,
            6,
            true,
            SpriteLibrary.SIZES.ZAMBONEY.width * 3
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

    static chaserLeft() {
        return new AnimatedSprite(
            'images/chaser-left.png',
            SpriteLibrary.SIZES.CHASER.width,
            SpriteLibrary.SIZES.CHASER.height,
            0,
            5,
            12,
            true
        );
    }

    static chaserRight() {
        return new AnimatedSprite(
            'images/chaser-right.png',
            SpriteLibrary.SIZES.CHASER.width,
            SpriteLibrary.SIZES.CHASER.height,
            0,
            5,
            12,
            true
        );
    }

    static bomberIdle() {
        return new AnimatedSprite(
            'images/bomber.png',
            SpriteLibrary.SIZES.BOMBER.width,
            SpriteLibrary.SIZES.BOMBER.height,
            0,
            1,
            1,
            false
        );
    }

    static bomberShoot() {
        return new AnimatedSprite(
            'images/bomber.png',
            SpriteLibrary.SIZES.BOMBER.width,
            SpriteLibrary.SIZES.BOMBER.height,
            0,
            5,
            8,
            true
        );
    }

    static sentryIdle() {
        return new AnimatedSprite(
            'images/sentry.png',
            SpriteLibrary.SIZES.SENTRY.width,
            SpriteLibrary.SIZES.SENTRY.height,
            0,
            15,
            6,
            true
        );
    }

    static sentryShootLeft() {
        return new AnimatedSprite(
            'images/sentry.png',
            SpriteLibrary.SIZES.SENTRY.width,
            SpriteLibrary.SIZES.SENTRY.height,
            0,
            2,
            12,
            false,
            SpriteLibrary.SIZES.SENTRY.width * 15
        );
    }

    static sentryShootRight() {
        return new AnimatedSprite(
            'images/sentry.png',
            SpriteLibrary.SIZES.SENTRY.width,
            SpriteLibrary.SIZES.SENTRY.height,
            0,
            2,
            12,
            false,
            SpriteLibrary.SIZES.SENTRY.width * 17
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

    static pounderIdle() {
        return new AnimatedSprite(
            'images/pounder.png',
            SpriteLibrary.SIZES.POUNDER.width,
            SpriteLibrary.SIZES.POUNDER.height,
            0,
            4,
            4,
            true
        );
    }

    static pounderPound() {
        return new AnimatedSprite(
            'images/pounder.png',
            SpriteLibrary.SIZES.POUNDER.width,
            SpriteLibrary.SIZES.POUNDER.height,
            0,
            4,
            4,
            false,
            SpriteLibrary.SIZES.POUNDER.width * 4
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

    static dumperIdle() {
        return new AnimatedSprite(
            'images/dumper.png',
            SpriteLibrary.SIZES.DUMPER.width,
            SpriteLibrary.SIZES.DUMPER.height,
            0,
            4,
            8,
            true
        );
    }

    static dumperShoot() {
        return new AnimatedSprite(
            'images/dumper.png',
            SpriteLibrary.SIZES.DUMPER.width,
            SpriteLibrary.SIZES.DUMPER.height,
            0,
            2,
            16,
            false,
            SpriteLibrary.SIZES.DUMPER.width * 4
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

    static rocket() {
        return new AnimatedSprite(
            'images/bomb-2.png',
            SpriteLibrary.SIZES.ROCKET.width,
            SpriteLibrary.SIZES.ROCKET.height,
            0,
            4,
            12,
            true
        );
    }

    static boss1Pace() {
        return new AnimatedSprite(
            'images/boss-1.png',
            SpriteLibrary.SIZES.BOSS_1.width,
            SpriteLibrary.SIZES.BOSS_1.height,
            0,
            8,
            10,
            true
        );
    }

    static boss1Shoot() {
        return new AnimatedSprite(
            'images/boss-1.png',
            SpriteLibrary.SIZES.BOSS_1.width,
            SpriteLibrary.SIZES.BOSS_1.height,
            0,
            1,
            0,
            false,
            SpriteLibrary.SIZES.BOSS_1.width * 3
        );
    }

    static boss2Idle() {
        return new AnimatedSprite(
            'images/boss-2.png',
            SpriteLibrary.SIZES.BOSS_2.width,
            SpriteLibrary.SIZES.BOSS_2.height,
            0,
            5,
            10,
            false
        );
    }

    static boss2Jump() {
        return new AnimatedSprite(
            'images/boss-2.png',
            SpriteLibrary.SIZES.BOSS_2.width,
            SpriteLibrary.SIZES.BOSS_2.height,
            0,
            5,
            10,
            false
        );
    }

    static boss3LeftIdle() {
        return new AnimatedSprite(
            'images/boss-3-left.png',
            SpriteLibrary.SIZES.BOSS_3.width,
            SpriteLibrary.SIZES.BOSS_3.height,
            0,
            3,
            10,
            true
        );
    }

    static boss3LeftJump() {
        return new AnimatedSprite(
            'images/boss-3-left.png',
            SpriteLibrary.SIZES.BOSS_3.width,
            SpriteLibrary.SIZES.BOSS_3.height,
            0,
            6,
            10,
            false
        );
    }

    static boss3RightIdle() {
        return new AnimatedSprite(
            'images/boss-3-right.png',
            SpriteLibrary.SIZES.BOSS_3.width,
            SpriteLibrary.SIZES.BOSS_3.height,
            0,
            3,
            10,
            true
        );
    }

    static boss3RightJump() {
        return new AnimatedSprite(
            'images/boss-3-right.png',
            SpriteLibrary.SIZES.BOSS_3.width,
            SpriteLibrary.SIZES.BOSS_3.height,
            0,
            6,
            10,
            false
        );
    }

    static boss4Idle() {
        return new AnimatedSprite(
            'images/boss-4.png',
            SpriteLibrary.SIZES.BOSS_4.width,
            SpriteLibrary.SIZES.BOSS_4.height,
            0,
            2,
            2,
            true
        );
    }

    static boss4Shoot() {
        return new AnimatedSprite(
            'images/boss-4.png',
            SpriteLibrary.SIZES.BOSS_4.width,
            SpriteLibrary.SIZES.BOSS_4.height,
            0,
            4,
            8,
            false
        );
    }

    static boss2Bomb() {
        return new AnimatedSprite(
            'images/boss-2.png',
            SpriteLibrary.SIZES.BOSS_2.width,
            SpriteLibrary.SIZES.BOSS_2.height,
            0,
            5,
            30,
            false
        );
    }

    static boss5Idle() {
        return new AnimatedSprite(
            'images/boss-5.png',
            SpriteLibrary.SIZES.BOSS_5.width,
            SpriteLibrary.SIZES.BOSS_5.height,
            0,
            4,
            5,
            true
        );
    }

    static boss5Shoot() {
        return new AnimatedSprite(
            'images/boss-5.png',
            SpriteLibrary.SIZES.BOSS_5.width,
            SpriteLibrary.SIZES.BOSS_5.height,
            0,
            4,
            10,
            false
        );
    }

    static boss5Jets() {
        return new AnimatedSprite(
            'images/boss-5-jets.png',
            SpriteLibrary.SIZES.BOSS_5_JETS.width,
            SpriteLibrary.SIZES.BOSS_5_JETS.height,
            0,
            3,
            6,
            true
        );
    }

    // World 1

    static world1BackgroundLayer0() {
        return new Sprite('images/level-1-bg-layer-0-fuzzy.png');
    }

    static world1BackgroundLayer1() {
        return new Sprite('images/level-1-bg-layer-1.png');
    }

    static world1BackgroundLayer2() {
        return new Sprite('images/level-1-bg-layer-2.png');
    }

    // World 2

    static world2BackgroundLayer0() {
        return new Sprite('images/level-2-bg-layer-0-fuzzy.png');
    }

    static world2BackgroundLayer1() {
        return new Sprite('images/level-2-bg-layer-1.png');
    }

    static world2BackgroundLayer2() {
        return new Sprite('images/level-2-bg-layer-2.png');
    }

    // World 3

    static world3BackgroundLayer0() {
        return new Sprite('images/level-3-bg-layer-0-fuzzy.png');
    }

    static world3BackgroundLayer1() {
        return new Sprite('images/level-3-bg-layer-1.png');
    }

    static world3BackgroundLayer2() {
        return new Sprite('images/level-3-bg-layer-2.png');
    }

    // World 4

    static world4BackgroundLayer0() {
        return new Sprite('images/level-4-bg-layer-0-fuzzy.png');
    }

    static world4BackgroundLayer1() {
        return new Sprite('images/level-4-bg-layer-1.png');
    }

    static world4BackgroundLayer2() {
        return new Sprite('images/level-4-bg-layer-2.png');
    }

    // World 5

    static world5BackgroundLayer0() {
        return new Sprite('images/level-5-bg-layer-0-fuzzy.png');
    }

    static world5BackgroundLayer1() {
        return new Sprite('images/level-5-bg-layer-1.png');
    }

    static world5BackgroundLayer2() {
        return new Sprite('images/level-5-bg-layer-2.png');
    }

    static healthUpHeart() {
        return new Sprite('images/heart.png');
    }
}
