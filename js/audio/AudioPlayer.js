export default class AudioPlayer {
    static instance = null;

    constructor() {
        this.playerList = [];
        this.volume = 0.1;
        this.allowSound = true;
    }

    static getInstance() {
        if (this.instance == null) {
            this.instance = new AudioPlayer();
        }
        return this.instance;
    }

    async playSound({ sound, loop }) {
        const player = new Audio();
        player.volume = this.volume;
        player.src = `../assets/audio/${sound}`;
        await player.play();

        if(loop) {
            player.loop = true;
        }

        player.addEventListener('ended', () => {
            const { playerList } = AudioPlayer.getInstance();
            player.pause();
            playerList.splice(playerList.indexOf(player), 1);
        });

        this.playerList.push(player);
    }

    stopAll() {
        this.playerList.forEach((player) => {
            player.pause()
            player.currentTime = 0;
            player.src = player.src;
        });
    }

    disableSound() {
        this.allowSound = false;
        this.stopAll();
    }

    async playAudio(audio, number = null, loop = false, bypass = false) {
        if(!this.allowSound && !bypass) {
            return;
        }

        console.log("hello")
        let audioName = audio;
        if(number) {
            audioName = `${audio.split('.')[0]}_${number}.${audio.split('.')[1]}`;
        }

        const player = new Audio();
        player.volume = this.volume;
        player.src = `../assets/audio/${audioName}`;
        await player.play();

        if(loop) {
            player.loop = true;
        }

        player.addEventListener('ended', () => {
            const { playerList } = AudioPlayer.getInstance();
            playerList.splice(playerList.indexOf(player), 1);
        });

        this.playerList.push(player);
    }
}
