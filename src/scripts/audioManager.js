import { SoundHandler } from './soundHandler.js';

export class AudioManager {
    static SOUNDS = {
        BACKGROUND_SONG: {
            url: 'sounds/piano-arp-live-update.aac',
            volume: 0.07,
            loop: true,
        },
        BOSS_SONG: {
            url: 'sounds/desert-trail.aac',
            volume: 0.35,
            loop: true,
        },
        FINALE_SONG: {
            url: 'sounds/stranger-mix-2.aac',
            volume: 0.2,
            loop: true,
        },
        BOSS_CELEBRATION_SONG: {
            url: 'sounds/boss-celebration.aac',
            volume: 0.3,
        },
        SHIELD_SONG: {
            url: 'sounds/shield-song.aac',
            volume: 0.4,
        },
        GEM_COLLECTED: {
            url: 'sounds/collectable.aac',
            volume: 0.45,
            preloadCount: 10,
        },
        BIG_BOMB: {
            url: 'sounds/fire-ball.aac',
            volume: 0.025,
        },
        HEALTH_UP: {
            url: 'sounds/health-up.aac',
            volume: 0.2,
        },
        PLAYER_JUMP: {
            url: 'sounds/jump.aac',
            volume: 0.08,
            preloadCount: 5,
        },
        PLAYER_SHOOT: {
            url: 'sounds/shoot.aac',
            volume: 0.16,
            preloadCount: 10,
        },
        LASER_COLLECTED: {
            url: 'sounds/laser-collected.aac',
            volume: 0.08,
        },
        LASER_GUN: {
            url: 'sounds/laser-gun.aac',
            volume: 0.25,
        },
        BOMB: {
            url: 'sounds/bomb.aac',
            volume: 0.04,
            preloadCount: 20,
        },
        PLAYER_HIT: {
            url: 'sounds/player-hit.aac',
            volume: 0.25,
        },
        ENEMY_HIT: {
            url: 'sounds/enemy-hit.aac',
            volume: 0.2,
            preloadCount: 20,
        },
        START_BOSS_LEVEL: {
            url: 'sounds/start-boss-level.aac',
            volume: 0.18,
        },
        ROBOTIC_DEATH: {
            // Unused, but neat, use for final boss!!
            url: 'sounds/robotic-death.aac',
            volume: 0.2,
        },
        BOSS_SHOT_1: {
            url: 'sounds/boss-hit.aac',
            volume: 0.3,
        },
        BOSS_SHOT_2: {
            url: 'sounds/boss-hit-2.aac',
            volume: 0.3,
        },
        BOSS_SHOT_4: {
            url: 'sounds/boss-hit-3.aac',
            volume: 0.3,
        },
        BOSS_4_SHOT_1: {
            url: 'sounds/boss-4-vox-1.aac',
            volume: 0.2,
        },
        BOSS_4_SHOT_2: {
            url: 'sounds/boss-4-vox-2.aac',
            volume: 0.2,
        },
        BOSS_5_SHOT: {
            url: 'sounds/boss-5-shot.aac',
            volume: 0.6,
        },
        BOSS_DEAD: {
            url: 'sounds/boss-dead.aac',
            volume: 0.25,
        },
    };

    constructor() {
        this.isMuted = false;
        this.soundHandlers = new Map();
        this.oneShotOnEnded = null;
        Object.keys(AudioManager.SOUNDS).forEach((sound) => {
            this.preloadHandlers(AudioManager.SOUNDS[sound]);
        });
    }

    preloadHandlers(sound) {
        const handlerCount = sound.preloadCount ?? 1;
        const handlers = [];
        for (let i = 0; i < handlerCount; i++) {
            handlers.push(new SoundHandler(sound));
        }
        this.soundHandlers.set(sound.url, handlers);
    }

    play(sound, onEnded = null) {
        const handlers = this.soundHandlers.get(sound.url);
        const availableHandler = handlers && handlers.length ? handlers.find((x) => x.isLoaded && !x.isPlaying) : null;
        if (!availableHandler) {
            const newHandler = new SoundHandler(sound, this.isMuted, true, onEnded);
            this.soundHandlers.set(sound.url, [newHandler]);
            return newHandler;
        }

        availableHandler.play(onEnded);
        return availableHandler;
    }

    mute() {
        this.soundHandlers.forEach((handlers) => {
            handlers.forEach((x) => x.mute());
        });
        this.isMuted = true;
    }

    unmute() {
        this.soundHandlers.forEach((handlers) => {
            handlers.forEach((x) => x.unmute());
        });
        this.isMuted = false;
    }
}
