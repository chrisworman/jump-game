export class AudioManager {
    static AUDIO_FILES = {
        BACKGROUND_SONG: {
            url: 'sounds/piano-arp.mp3',
            volume: 0.05,
        },
        BOSS_SONG: {
            url: 'sounds/desert-trail.mp3',
            volume: 0.1,
        },
        COLLECTABLE_COLLECTED: {
            url: 'sounds/collectable.mp3',
            volume: 1.0,
        },
        PLAYER_JUMP: {
            url: 'sounds/jump.mp3',
            volume: 0.1,
        },
        PLAYER_SHOOT: {
            url: 'sounds/shoot.mp3',
            volume: 0.2,
        },
        PLAYER_HIT: {
            url: 'sounds/player-hit.mp3',
            volume: 0.5,
        },
        ENEMY_HIT: {
            url: 'sounds/enemy-hit.mp3',
            volume: 0.5,
        },
    };

    constructor() {
        this.isMuted = false;
        this.loadedAudioFiles = new Map();
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
                console.log(`AudioManager :: Loaded ${audioFile}`);
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
}
