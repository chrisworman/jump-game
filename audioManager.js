export class AudioManager {
	constructor() {
		this.soundsByKey = new Map();
	}

	load(key, audioFileUrl) {
		const audioElement = new Audio();
        const sound = {
            audioElement: audioElement,
            isLoaded: false,
        };
        this.soundsByKey.set(key, sound);
        audioElement.addEventListener("loadeddata", () => {
            if (audioElement.readyState >= 2) {
                sound.isLoaded = true;
            }
          });
		const sourceElement = document.createElement("source");
		sourceElement.type = "audio/mpeg";
		sourceElement.src = audioFileUrl;
		audioElement.appendChild(sourceElement);
	}

    play(key) {
        const sound = this.soundsByKey.get(key);
        if (!sound) {
            console.error(`No audio file found for key ${key}`);
            return;
        }

        if (sound.isLoaded) {
            sound.audioElement.pause();
            sound.audioElement.currentTime = 0;
            sound.audioElement.play();
        }
    }
}
