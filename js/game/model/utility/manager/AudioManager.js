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
        this.playList.forEach((player) => {
            const gainNode = AssetManager.source.createGain();
            gainNode.gain.value = this._volume;
            player.connect(gainNode);
        });
    }
    static decreaseVolume() {
        if (this._volume > 0) {
            this._volume -= 0.1;
        }
        this.playList.forEach((player) => {
            const gainNode = AssetManager.source.createGain();
            gainNode.gain.value = this._volume;
            player.connect(gainNode);
        });
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
            player.stop();
        });
        this.playList = [];
    }
    static stop(audio) {
        if (!audio) {
            return;
        }
        audio.stop();
    }
    static playAudio(audio, loop = false, bypass = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.allowSound && !bypass) {
                return null;
            }
            const buffer = AssetManager.getAudio(audio);
            if (buffer == null) {
                return null;
            }
            const source = AssetManager.source.createBufferSource();
            source.buffer = buffer;
            const gainNode = AssetManager.source.createGain();
            gainNode.gain.value = this._volume;
            gainNode.connect(AssetManager.source.destination);
            source.connect(gainNode);
            source.start();
            if (loop) {
                source.loop = true;
            }
            source.addEventListener('ended', () => {
                this.playList.splice(this.playList.indexOf(source), 1);
            });
            source.addEventListener('abort', () => {
                this.playList.splice(this.playList.indexOf(source), 1);
            });
            source.addEventListener('error', () => {
                this.playList.splice(this.playList.indexOf(source), 1);
            });
            this.playList.push(source);
            return source;
        });
    }
}
AudioManager.playList = [];
AudioManager.allowSound = true;
AudioManager._volume = 0.1;
export default AudioManager;
