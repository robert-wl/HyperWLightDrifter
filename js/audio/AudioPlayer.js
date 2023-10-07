export default class AudioPlayer {
    static instance = null;

    constructor() {
        this.audioList = [];
        this.volume = 0.1;
        this.allowSound = true;
    }

    static getInstance() {
        if (this.instance == null) {
            this.instance = new AudioPlayer();
        }
        return this.instance;
    }

    increaseVolume() {
        if (this.volume < 1) {
            this.volume += 0.1;
        }
        if (this.volume > 1) {
            this.volume = 1;
        }

        for (const played of this.audioList) {
            played.volume = this.volume;
        }
    }

    decreaseVolume() {
        if (this.volume > 0) {
            this.volume -= 0.1;
        }
        if (this.volume < 0) {
            this.volume = 0;
        }

        for (const played of this.audioList) {
            played.volume = this.volume;
        }
    }

    async playSound({ sound, loop }) {
        const player = new Audio();
        player.volume = this.volume;
        player.src = `../assets/audio/${sound}`;
        await player.play();

        if (loop) {
            player.loop = true;
        }

        player.addEventListener('ended', () => {
            const { audioList } = AudioPlayer.getInstance();
            player.pause();
            audioList.splice(audioList.indexOf(player), 1);
        });

        this.audioList.push(player);
    }

    stop(audio) {
        if (!audio) {
            return;
        }
        audio.pause();
        audio.currentTime = 0;
        audio.src = audio.src;
    }

    stopAll() {
        this.audioList.forEach((player) => {
            player.pause();
            player.currentTime = 0;
            player.src = player.src;
        });
    }

    disableSound() {
        this.allowSound = false;
        this.stopAll();
    }

    async playAudio(audio, number = null, loop = false, bypass = false, volume = this.volume) {
        if (!this.allowSound && !bypass) {
            return;
        }

        let audioName = audio;
        if (number) {
            audioName = `${audio.split('.')[0]}_${number}.${audio.split('.')[1]}`;
        }

        const player = new Audio();
        player.volume = volume;
        player.src = `../assets/audio/${audioName}`;
        await player.play();

        if (loop) {
            player.loop = true;
        }

        player.addEventListener('ended', () => {
            const { audioList } = AudioPlayer.getInstance();
            audioList.splice(audioList.indexOf(player), 1);
        });

        this.audioList.push(player);
        return player;
    }
}
