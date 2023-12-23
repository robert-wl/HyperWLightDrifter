import AudioVisualizer from './AudioVisualizer.js';

interface AudioPlayerConstructor {
    audioVisualizer: AudioVisualizer;
    audioSlider: HTMLInputElement;
    audioToggleButton: HTMLElement[];
}

export default class AudioPlayer {
    private readonly audioProgress: HTMLCanvasElement;
    private audioVisualizer: AudioVisualizer;
    private audioSlider: HTMLInputElement;
    private readonly audioToggleButton: HTMLElement[];
    private isPlaying: boolean = false;

    constructor({ audioVisualizer, audioSlider, audioToggleButton }: AudioPlayerConstructor) {
        this.audioProgress = $('#audio-progress')[0] as HTMLCanvasElement;
        this.audioProgress.width = 600;
        this.audioProgress.height = 600;
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
            this.audioProgressVisualizer(newPosition);
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

    private audioProgressVisualizer(position: number) {
        const ctx = this.audioProgress.getContext('2d')!;
        ctx.clearRect(0, 0, 600, 600);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 5;
        
        if (position > 0) {
            ctx.lineTo(Math.min(position / 25, 1) * 600, 0);
        }
        if (position > 25) {
            ctx.lineTo(600, Math.min((position - 25) / 25, 1) * 600);
        }
        if (position > 50) {
            ctx.lineTo(600 - Math.min((position - 50) / 25, 1) * 600, 600);
        }
        if (position > 75) {
            ctx.lineTo(0, 600 - Math.min((position - 75) / 25, 1) * 600);
        }
        ctx.stroke();
    }

    private audioToggle(state?: boolean) {
        if (state !== null || state !== this.isPlaying) {
            for (const button of this.audioToggleButton) {
                button.classList.toggle('disabled');
            }
        }

        if (state) {
            this.audioToggleButton[0].classList.add('disabled');
            this.audioToggleButton[1].classList.remove('disabled');
        } else {
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
