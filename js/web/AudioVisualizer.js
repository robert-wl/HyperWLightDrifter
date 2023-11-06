export default class AudioVisualizer {
    constructor({ source }) {
        this._audio = new Audio(source);
        this._canvas = $('#audio-visualizer')[0];
        this._ctx = this._canvas.getContext('2d');
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
    get audio() {
        return this._audio;
    }
    set audio(value) {
        this._audio = value;
    }
    get canvas() {
        return this._canvas;
    }
    set canvas(value) {
        this._canvas = value;
    }
    get ctx() {
        return this._ctx;
    }
    set ctx(value) {
        this._ctx = value;
    }
    get analyser() {
        return this._analyser;
    }
    set analyser(value) {
        this._analyser = value;
    }
    get bufferLength() {
        return this._bufferLength;
    }
    set bufferLength(value) {
        this._bufferLength = value;
    }
    get dataArray() {
        return this._dataArray;
    }
    set dataArray(value) {
        this._dataArray = value;
    }
    get barWidth() {
        return this._barWidth;
    }
    set barWidth(value) {
        this._barWidth = value;
    }
    playAudio() {
        this._audio.play().then();
    }
    pauseAudio() {
        this._audio.pause();
    }
    animateCanvas() {
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
    getColor(barHeight, i) {
        const red = barHeight + 25 * (i / this._bufferLength);
        const green = 250 * (i / this._bufferLength);
        const blue = 50;
        return { red, green, blue };
    }
}
