interface AudioVisualizerConstructor {
    source: string;
}

export default class AudioVisualizer {
    constructor({ source }: AudioVisualizerConstructor) {
        this._audio = new Audio(source);

        this._canvas = $('#audio-visualizer')[0] as HTMLCanvasElement;
        this._ctx = this._canvas.getContext('2d')!;

        const audioCtx = new window.AudioContext();
        let audioSource;

        audioSource = audioCtx.createMediaElementSource(this._audio);
        this.analyser = audioCtx.createAnalyser();
        audioSource.connect(this.analyser);
        this.analyser.connect(audioCtx.destination);

        this.analyser.fftSize = Math.pow(2, 9);
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.barWidth = this._canvas.width / this.bufferLength;

        this.animateCanvas();
    }

    private _audio: HTMLAudioElement;

    get audio(): HTMLAudioElement {
        return this._audio;
    }

    set audio(value: HTMLAudioElement) {
        this._audio = value;
    }

    private _canvas: HTMLCanvasElement;

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    set canvas(value: HTMLCanvasElement) {
        this._canvas = value;
    }

    private _ctx: CanvasRenderingContext2D;

    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }

    set ctx(value: CanvasRenderingContext2D) {
        this._ctx = value;
    }

    private readonly analyser: AnalyserNode;

    private readonly bufferLength: number;

    private readonly dataArray: Uint8Array;

    private readonly barWidth: number;

    public playAudio() {
        this._audio.play().then();
    }

    public pauseAudio() {
        this._audio.pause();
    }

    private animateCanvas() {
        let x = 0;

        let barHeight = 0;
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.analyser.getByteFrequencyData(this.dataArray);
        for (let i = 0; i < this.bufferLength; i++) {
            barHeight = Math.pow(this.dataArray[i], 3) / 210 ** 2;

            const { green, blue } = this.getColor(barHeight, i);

            this._ctx.fillStyle = `rgb(253, ${green}, ${blue})`;

            this._ctx.fillRect(x, this._canvas.height / 2 - barHeight, this.barWidth, barHeight);
            this._ctx.fillStyle = `rgb(103, ${green}, ${blue})`;
            this._ctx.fillRect(x, this._canvas.height / 2, this.barWidth, barHeight);
            x += this.barWidth * 4;
        }
        requestAnimationFrame(() => this.animateCanvas());
    }

    private getColor(barHeight: number, i: number) {
        const red = barHeight + 25 * (i / this.bufferLength);
        const green = 250 * (i / this.bufferLength);
        const blue = 50;

        return { red, green, blue };
    }
}
