import AssetManager from './AssetManager.js';

export default class AudioManager {
    private static assetList = AssetManager.assetList;
    private static playList: HTMLAudioElement[] = [];
    private static allowSound = true;
    private static _volume = 0.1;

    private constructor() {
        //
    }

    static get volume(): number {
        return this._volume;
    }

    static set volume(value: number) {
        this._volume = value;
    }

    public static increaseVolume() {
        if (this._volume < 1) {
            this._volume += 0.1;
        }
    }

    public static decreaseVolume() {
        if (this._volume > 0) {
            this._volume -= 0.1;
        }
    }

    public static disableSound() {
        this.allowSound = false;
        this.stopAll();
    }

    public static stopAll() {
        this.playList.forEach((player) => {
            player.pause();
            player.currentTime = 0;
            player.src = player.src;
        });
    }

    public static stop(audio: HTMLAudioElement | null) {
        if (!audio) {
            return;
        }
        audio.pause();
        audio.currentTime = 0;
        audio.src = audio.src;
    }

    public static async playAudio(audio: string, number?: number | null, loop = false, bypass = false) {
        if (!this.allowSound && !bypass) {
            return null;
        }

        let audioName = audio;
        if (number) {
            audioName = `${audio.split('.')[0]}_${number}.${audio.split('.')[1]}`;
        }

        let player = this.assetList.get(audioName) as HTMLAudioElement;

        if (player == null) {
            player = new Audio(`../assets/audio/${audioName}`);
        }

        player.volume = this._volume;
        await player.play();

        if (loop) {
            player.loop = true;
        }

        player.addEventListener('ended', () => {
            this.playList.splice(this.playList.indexOf(player), 1);
        });

        this.playList.push(player);

        return player;
    }
}
