export default class AudioPlayer {
    constructor({ audioVisualizer, audioSlider, audioToggleButton }) {
        this.isPlaying = false;
        this.audioVisualizer = audioVisualizer;
        this.audioSlider = audioSlider;
        this.audioToggleButton = audioToggleButton;
        this.playerEventHandler();
    }
    playerEventHandler() {
        const audio = this.audioVisualizer.audio;
        audio.addEventListener('timeupdate', () => {
            const newPosition = (audio.currentTime / audio.duration) * 100;
            this.audioSlider.value = String(newPosition);
        });
        this.audioSlider.addEventListener('input', () => {
            this.audioVisualizer.audio.currentTime = (Number(this.audioSlider.value) / 100) * audio.duration;
            this.audioToggle(true);
            this.audioVisualizer.playAudio();
        });
        this.audioToggleButton[0].addEventListener('click', () => {
            this.audioToggle(true);
        });
        this.audioToggleButton[1].addEventListener('click', () => {
            this.audioToggle(false);
        });
    }
    audioToggle(state) {
        if (state !== null || state !== this.isPlaying) {
            for (const button of this.audioToggleButton) {
                button.classList.toggle('disabled');
            }
        }
        if (state) {
            this.audioToggleButton[0].classList.add('disabled');
            this.audioToggleButton[1].classList.remove('disabled');
        }
        else {
            this.audioToggleButton[0].classList.remove('disabled');
            this.audioToggleButton[1].classList.add('disabled');
        }
        this.isPlaying = state || !this.isPlaying;
        if (this.isPlaying) {
            this.audioVisualizer.playAudio();
            return;
        }
        this.audioVisualizer.pauseAudio();
    }
}
