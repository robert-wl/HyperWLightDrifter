import AssetManager from './AssetManager.js';

export default class AudioManager {
    private static playList: AudioBufferSourceNode[] = [];
    private static allowSound = true;
    private static _volume = 0.1;

    static get volume(): number {
        return this._volume;
    }

    public static increaseVolume() {
        if (this._volume < 1) {
            this._volume += 0.1;
        }
        this.playList.forEach((player) => {
            const gainNode = AssetManager.source.createGain();
            gainNode.gain.value = this._volume;
            player.connect(gainNode);
        });
    }

    public static decreaseVolume() {
        if (this._volume > 0) {
            this._volume -= 0.1;
        }
        this.playList.forEach((player) => {
            const gainNode = AssetManager.source.createGain();
            gainNode.gain.value = this._volume;
            player.connect(gainNode);
        });
    }

    public static disableSound() {
        this.allowSound = false;
        this.stopAll();
    }

    public static enableSound() {
        this.allowSound = true;
    }

    public static stopAll() {
        this.playList.forEach((player) => {
            player.stop()
        });
        this.playList = []
    }

    public static stop(audio: AudioBufferSourceNode | null) {
        if (!audio) {
            return;
        }
        audio.stop()
    }

    public static async playAudio(audio: string, loop = false, bypass = false) {
        if (!this.allowSound && !bypass) {
            return null;
        }

        const buffer = AssetManager.getAudio(audio);

        if (buffer == null) {
            return null;
        }

        const source = AssetManager.source.createBufferSource()

        source.buffer = buffer;

        const gainNode = AssetManager.source.createGain();
        gainNode.gain.value = this._volume;
        gainNode.connect(AssetManager.source.destination)

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
    }
}
