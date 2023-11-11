var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AssetManager from './AssetManager.js';
class AudioManager {
    static get volume() {
        return this._volume;
    }
    static increaseVolume() {
        if (this._volume < 1) {
            this._volume += 0.1;
        }
        this.playList.forEach((player) => (player.volume = this._volume));
    }
    static decreaseVolume() {
        if (this._volume > 0) {
            this._volume -= 0.1;
        }
        this.playList.forEach((player) => (player.volume = this._volume));
    }
    static disableSound() {
        this.allowSound = false;
        this.stopAll();
    }
    static enableSound() {
        this.allowSound = true;
    }
    static stopAll() {
        this.playList.forEach((player) => {
            player.pause();
            player.currentTime = 0;
            player.src = player.src;
        });
    }
    static stop(audio) {
        if (!audio) {
            return;
        }
        audio.pause();
        audio.currentTime = 0;
        audio.src = audio.src;
    }
    static playAudio(audio, loop = false, bypass = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.allowSound && !bypass) {
                return null;
            }
            let player = this.assetList.get(audio);
            if (player == null) {
                return null;
            }
            player = player.cloneNode(true);
            player.volume = this._volume;
            yield player.play();
            if (loop) {
                player.loop = true;
            }
            player.addEventListener('ended', () => {
                this.playList.splice(this.playList.indexOf(player), 1);
            });
            this.playList.push(player);
            return player;
        });
    }
}
AudioManager.assetList = AssetManager.assetList;
AudioManager.playList = [];
AudioManager.allowSound = true;
AudioManager._volume = 0.1;
export default AudioManager;
