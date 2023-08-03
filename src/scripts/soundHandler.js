export class SoundHandler {
    constructor(sound, isMuted, playOnLoad = false, onEnded = null) {
        this.sound = sound;
        this.isLoaded = false;
        this.isPlaying = false;

        this.audio = new Audio();
        this.audio.volume = isMuted ? 0 : sound.volume;

        // Attach the listener _before_ setting the source element
        this.audio.addEventListener('loadeddata', () => {
            if (this.audio.readyState >= 2) {
                this.isLoaded = true;
                if (playOnLoad) {
                    this.play(onEnded);
                }
            }
        });

        const sourceElement = document.createElement('source');
        sourceElement.type = 'audio/aac';
        sourceElement.src = sound.url;
        this.audio.appendChild(sourceElement);
    }

    play(onEnded) {
        if (!this.isLoaded) {
            throw new Error(`${this.sound.url} handler not loaded`);
        }

        if (this.isPlaying) {
            throw new Error(`${this.sound.url} already playing`);
        }

        this.isPlaying = true;
        this.audio.addEventListener(
            'ended',
            () => {
                this.isPlaying = false;
                if (onEnded) {
                    onEnded();
                }
            },
            {
                once: true,
            }
        );

        this.audio.currentTime = 0;
        this.audio.loop = this.sound.loop;
        this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
    }

    mute() {
        this.audio.volume = 0;
    }

    unmute() {
        this.audio.volume = this.sound.volume;
    }
}
