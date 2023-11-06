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
        this._analyser = audioCtx.createAnalyser();
        audioSource.connect(this._analyser);
        this._analyser.connect(audioCtx.destination);

        this._analyser.fftSize = Math.pow(2, 9);
        this._bufferLength = this._analyser.frequencyBinCount;
        this._dataArray = new Uint8Array(this._bufferLength);
        this._barWidth = this._canvas.width / this._bufferLength;

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

    private _analyser: AnalyserNode;

    get analyser(): AnalyserNode {
        return this._analyser;
    }

    set analyser(value: AnalyserNode) {
        this._analyser = value;
    }

    private _bufferLength: number;

    get bufferLength(): number {
        return this._bufferLength;
    }

    set bufferLength(value: number) {
        this._bufferLength = value;
    }

    private _dataArray: Uint8Array;

    get dataArray(): Uint8Array {
        return this._dataArray;
    }

    set dataArray(value: Uint8Array) {
        this._dataArray = value;
    }

    private _barWidth: number;

    get barWidth(): number {
        return this._barWidth;
    }

    set barWidth(value: number) {
        this._barWidth = value;
    }

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
        this._analyser.getByteFrequencyData(this._dataArray);
        for (let i = 0; i < this._bufferLength; i++) {
            barHeight = Math.pow(this._dataArray[i], 3) / 210 ** 2;

            const { green, blue } = this.getColor(barHeight, i);

            this._ctx.fillStyle = `rgb(253, ${green}, ${blue})`;

            this._ctx.fillRect(x, this._canvas.height / 2 - barHeight, this._barWidth, barHeight);
            this._ctx.fillStyle = `rgb(103, ${green}, ${blue})`;
            this._ctx.fillRect(x, this._canvas.height / 2, this._barWidth, barHeight);
            x += this._barWidth * 4;
        }
        requestAnimationFrame(() => this.animateCanvas());
    }

    private getColor(barHeight: number, i: number) {
        const red = barHeight + 25 * (i / this._bufferLength);
        const green = 250 * (i / this._bufferLength);
        const blue = 50;

        return { red, green, blue };
    }
}
