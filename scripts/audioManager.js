export class AudioManager {
	static AUDIO_FILES = {
		BACKGROUND_SONG: "sounds/stranger-mix-2.mp3",
		COLLECTABLE_COLLECTED: "sounds/collected.mp3",
		PLAYER_JUMP: "sounds/jump.mp3",
		PLAYER_SHOOT: "sounds/shoot.mp3",
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
		audioElement.volume = 0.1; // The sounds seem really loud!
		const sound = {
			audioElement: audioElement,
			isLoaded: false,
		};
		this.loadedAudioFiles.set(audioFile, sound);
		audioElement.addEventListener("loadeddata", () => {
			if (audioElement.readyState >= 2) {
				console.log(`AudioManager :: Loaded ${audioFile}`);
				sound.isLoaded = true;
				if (sound.playOnLoaded) {
					audioElement.play();
				}
				sound.playOnLoaded = false;
			}
		});
		const sourceElement = document.createElement("source");
		sourceElement.type = "audio/mpeg";
		sourceElement.src = audioFile;
		audioElement.appendChild(sourceElement);
	}

	play(audioFile, loop = false) {
		const sound = this.loadedAudioFiles.get(audioFile);
		if (!sound) {
			console.error(`AudioManager :: Not found ${audioFile}`);
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

	mute() {
		Array.from(this.loadedAudioFiles.values()).forEach((sound) => {
			sound.audioElement.volume = 0; // TODO: same volume
		});
		this.isMuted = true;
	}

	unmute() {
		Array.from(this.loadedAudioFiles.values()).forEach((sound) => {
			sound.audioElement.volume = 0.1; // TODO: used cached / initial volume
		});
		this.isMuted = false;
	}
}