import { Boss1 } from "./boss1.js";
import { Boss2 } from "./boss2.js";
import { Boss3 } from "./boss3.js";
import { Boss4 } from "./boss4.js";
import { Boss5 } from "./boss5.js";
import { LevelManager } from "./levelManager.js";

export class World {
    constructor(game, number, song, bossSong, bossCelebrationSong) {
        this.game = game;
        this.number = number;
        this.song = song;
        this.bossSong = bossSong;
        this.bossCelebrationSong = bossCelebrationSong;
        this.title = `World ${number}`;
        this.songHandler = null;
    }

    playSong() {
        if (this.songHandler) {
            this.songHandler.stop();
        }
        this.songHandler = this.game.audioManager.play(this.song);
    }

    playBossSong() {
        if (this.songHandler) {
            this.songHandler.stop();
        }
        this.songHandler = this.game.audioManager.play(this.bossSong);
    }

    playBossCelebrationSongThen(then) {
        if (this.songHandler) {
            this.songHandler.stop();
        }
        this.songHandler = this.game.audioManager.play(this.bossCelebrationSong, then);
    }

    stopSong() {
        if (this.songHandler) {
            this.songHandler.stop();
        }
    }

    isLast() {
        return this.number === LevelManager.WORLD_COUNT;
    }

    getBoss() {
        switch (this.number) {
            case 1: return Boss1.spawn(this.game);
            case 2: return Boss2.spawn(this.game);
            case 3: return Boss3.spawn(this.game);
            case 4: return Boss4.spawn(this.game);
            case 5: return Boss5.spawn(this.game);
        }
    }
}
