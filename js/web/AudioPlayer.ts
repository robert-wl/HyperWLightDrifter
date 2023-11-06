import AudioVisualizer from './AudioVisualizer';

interface AudioPlayerConstructor {
    audioVisualizer: AudioVisualizer;
    audioSlider: HTMLInputElement;
    audioToggleButton: HTMLElement[];
}

export default class AudioPlayer {
    private audioVisualizer: AudioVisualizer;
    private audioSlider: HTMLInputElement;
    private audioToggleButton: HTMLElement[];
    private isPlaying: boolean = false;

    constructor({ audioVisualizer, audioSlider, audioToggleButton }: AudioPlayerConstructor) {
        this.audioVisualizer = audioVisualizer;
        this.audioSlider = audioSlider;
        this.audioToggleButton = audioToggleButton;

        this.playerEventHandler();
    }

    private playerEventHandler() {
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

        this.audioToggleButton.forEach((button) => {
            button.addEventListener('click', () => {
                console.log('hai');
                this.audioToggle();
            });
        });
    }

    private audioToggle(state?: boolean) {
        if (state !== null || state !== this.isPlaying) {
            for (const button of this.audioToggleButton) {
                button.classList.toggle('disabled');
            }
        }

        this.isPlaying = state || !this.isPlaying;

        if (this.isPlaying) {
            this.audioVisualizer.playAudio();
            return;
        }

        this.audioVisualizer.pauseAudio();
    }
}
