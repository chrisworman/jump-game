export class AudioManager {
    static AUDIO_FILES = {
        BACKGROUND_SONG: {
            url: 'sounds/piano-arp-live-update.mp3',
            volume: 0.07,
        },
        BOSS_SONG: {
            url: 'sounds/desert-trail.mp3',
            volume: 0.35,
        },
        FINALE_SONG: {
            url: 'sounds/stranger-mix-2.mp3',
            volume: 0.2,
        },
        BOSS_CELEBRATION_SONG: {
            url: 'sounds/boss-celebration.mp3',
            volume: 0.3,
        },
        GEM_COLLECTED: {
            url: 'sounds/collectable.mp3',
            volume: 0.6,
        },
        FIRE_BALL: {
            url: 'sounds/fire-ball.mp3',
            volume: 0.025,
        },
        HEALTH_UP: {
            url: 'sounds/health-up.mp3',
            volume: 0.2,
        },
        PLAYER_JUMP: {
            url: 'sounds/jump.mp3',
            volume: 0.08,
        },
        PLAYER_SHOOT: {
            url: 'sounds/shoot.mp3',
            volume: 0.16,
        },
        LASER_COLLECTED: {
            url: 'sounds/laser-collected.mp3',
            volume: 0.08,
        },
        LASER_GUN: {
            url: 'sounds/laser-gun.mp3',
            volume: 0.18 ,
        },
        BOMB: {
            url: 'sounds/bomb.mp3',
            volume: 0.04,
        },
        PLAYER_HIT: {
            url: 'sounds/player-hit.mp3',
            volume: 0.35,
        },
        ENEMY_HIT: {
            url: 'sounds/enemy-hit.mp3',
            volume: 0.3,
        },
        START_BOSS_LEVEL: {
            url: 'sounds/start-boss-level.mp3',
            volume: 0.18,
        },
        ROBOTIC_DEATH: { // Unused, but neat
            url: 'sounds/robotic-death.mp3',
            volume: 0.05,
        },
        BOSS_SHOT_1: {
            url: 'sounds/boss-hit.mp3',
            volume: 0.3,
        },
        BOSS_SHOT_2: {
            url: 'sounds/boss-hit-2.mp3',
            volume: 0.3,
        },
        BOSS_SHOT_3: {
            url: 'sounds/boss-hit-3.mp3',
            volume: 0.3,
        },
        BOSS_DEAD: {
            url: 'sounds/boss-dead.mp3',
            volume: 0.25,
        },
    };

    constructor() {
        this.isMuted = false;
        this.loadedAudioFiles = new Map();
        this.oneShotOnEnded = null;
        Object.keys(AudioManager.AUDIO_FILES).forEach((audioFile) => {
            this.load(AudioManager.AUDIO_FILES[audioFile]);
        });
    }

    load(audioFile) {
        const audioElement = new Audio();
        audioElement.volume = audioFile.volume;
        const sound = {
            audioElement: audioElement,
            isLoaded: false,
            savedVolume: audioElement.volume,
        };
        this.loadedAudioFiles.set(audioFile.url, sound);
        audioElement.addEventListener('loadeddata', () => {
            if (audioElement.readyState >= 2) {
                console.log(`AudioManager :: Loaded ${audioFile.url}`);
                sound.isLoaded = true;
                if (sound.playOnLoaded) {
                    audioElement.play();
                }
                sound.playOnLoaded = false;
            }
        });
        const sourceElement = document.createElement('source');
        sourceElement.type = 'audio/mpeg';
        sourceElement.src = audioFile.url;
        audioElement.appendChild(sourceElement);
    }

    play(audioFile, loop = false) {
        const sound = this.loadedAudioFiles.get(audioFile.url);
        if (!sound) {
            console.error(`AudioManager :: Not found ${audioFile.url}`);
            return;
        }

        if (sound.isLoaded) {
            if (this.oneShotOnEnded) {
                const onEnded = this.oneShotOnEnded;
                this.oneShotOnEnded = null;
                sound.audioElement.addEventListener('ended', onEnded, {
                    once: true,
                });
            }
            sound.audioElement.pause();
            sound.audioElement.currentTime = 0;
            sound.audioElement.loop = loop;
            sound.audioElement.play();
        } else {
            sound.playOnLoaded = true;
        }
    }

    stop(audioFile) {
        const sound = this.loadedAudioFiles.get(audioFile.url);
        if (!sound) {
            console.error(`AudioManager :: Not found ${audioFile.url}`);
            return;
        }

        if (sound.isLoaded) {
            sound.audioElement.pause();
            sound.audioElement.currentTime = 0;
        } else {
            sound.playOnLoaded = false;
        }
    }

    mute() {
        Array.from(this.loadedAudioFiles.values()).forEach((sound) => {
            sound.savedVolume = sound.audioElement.volume;
            sound.audioElement.volume = 0;
        });
        this.isMuted = true;
    }

    unmute() {
        Array.from(this.loadedAudioFiles.values()).forEach((sound) => {
            sound.audioElement.volume = sound.savedVolume;
        });
        this.isMuted = false;
    }

    setOneShotOnEnded(onEnded) {
        this.oneShotOnEnded = onEnded;
    }
}
