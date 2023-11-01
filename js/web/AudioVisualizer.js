export default class AudioVisualizer {
    constructor({ source }) {
        this.audio = new Audio(source);
        this.x = 0;

        this.canvas = $('#audio-visualizer')[0];
        this.ctx = this.canvas.getContext('2d');

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let audioSource = null;
        this.analyser = null;

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
        let barHeight = 0;
        this.x = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.analyser.getByteFrequencyData(this.dataArray);
        for (let i = 0; i < this.bufferLength; i++) {
            // console.log('haui');
            barHeight = Math.pow(this.dataArray[i], 3) / 210 ** 2;
            // barHeight = this.dataArray[i];
            const red = barHeight + 25 * (i / this.bufferLength);
            const green = 250 * (i / this.bufferLength);
            const blue = 50;
            // this.ctx.fillStyle = `hsl(${(barHeight / 256) * 360}, 50%, 50%)`;
            this.ctx.fillStyle = `rgb(253, ${green}, ${blue})`;
            // console.log(this.canvas.height);
            // continue;
            this.ctx.fillRect(this.x, this.canvas.height / 2 - barHeight, this.barWidth, barHeight);
            this.ctx.fillStyle = `rgb(103, ${green}, ${blue})`;
            this.ctx.fillRect(this.x, this.canvas.height / 2, this.barWidth, barHeight);
            this.x += this.barWidth * 4;
        }
        // console.log(this.x, this.canvas.height / 2 - 10, 2000, this.canvas.height / 2 + 20);
        this.ctx.fillStyle = `white`;
        // this.ctx.fillRect(0, this.canvas.height / 2 - 2, 2000, 4);

        requestAnimationFrame(() => this.animate());
    }
}
