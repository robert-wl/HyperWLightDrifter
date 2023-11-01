"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AudioVisualizer {
    constructor(source) {
        this.audio = new Audio(source);
        this.canvas = $('#audio-visualizer')[0];
        this.ctx = this.canvas.getContext('2d');
        const audioCtx = new window.AudioContext();
        let audioSource;
        this.audio.play().then();
        audioSource = audioCtx.createMediaElementSource(this.audio);
        this.analyser = audioCtx.createAnalyser();
        audioSource.connect(this.analyser);
        this.analyser.connect(audioCtx.destination);
        this.analyser.fftSize = Math.pow(2, 9);
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.barWidth = this.canvas.width / (this.bufferLength * 2);
        this.animate();
    }
    animate() {
        let x = 0;
        let barHeight = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.analyser.getByteFrequencyData(this.dataArray);
        for (let i = 0; i < this.bufferLength; i++) {
            barHeight = Math.pow(this.dataArray[i], 3) / 210 ** 2;
            const { red, green, blue } = this.getColor(barHeight, i);
            // this.ctx.fillStyle = `hsl(${(barHeight / 256) * 360}, 50%, 50%)`;
            this.ctx.fillStyle = `rgb(253, ${green}, ${blue})`;
            this.ctx.fillRect(x, this.canvas.height / 2 - barHeight, this.barWidth, barHeight);
            this.ctx.fillStyle = `rgb(103, ${green}, ${blue})`;
            this.ctx.fillRect(x, this.canvas.height / 2, this.barWidth, barHeight);
            x += this.barWidth * 4;
        }
        this.ctx.fillStyle = `white`;
        requestAnimationFrame(() => this.animate());
    }
    getColor(barHeight, i) {
        const red = barHeight + 25 * (i / this.bufferLength);
        const green = 250 * (i / this.bufferLength);
        const blue = 50;
        return { red, green, blue };
    }
}
exports.default = AudioVisualizer;
