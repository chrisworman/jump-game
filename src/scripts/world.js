import { Boss1 } from "./boss1.js";
import { Boss2 } from "./boss2.js";
import { Boss3 } from "./boss3.js";

export class World {
    constructor(game, number, song, bossSong, bossCelebrationSong) {
        this.game = game;
        this.number = number;
        this.song = song;
        this.bossSong = bossSong;
        this.bossCelebrationSong = bossCelebrationSong;
        this.title = `World ${number}`;
    }

    playSong() {
        this.game.audioManager.play(this.song, true);
    }

    playBossSong() {
        this.game.audioManager.play(this.bossSong, true);
    }

    playBossCelebrationSongThen(then) {
        this.game.audioManager.setOneShotOnEnded(then);
        this.game.audioManager.play(this.bossCelebrationSong);
    }

    stopSong() {
        this.game.audioManager.stop(this.song);
    }

    stopBossSong() {
        this.game.audioManager.stop(this.bossSong);
    }

    getBoss() {
        switch (this.number) {
            // case 1: return Boss1.spawn(this.game);
            // case 2: return Boss2.spawn(this.game);
            // case 3: return Boss3.spawn(this.game);
            // TODO: design remaining bosses
            default: return Boss3.spawn(this.game);
        }
    }
}
