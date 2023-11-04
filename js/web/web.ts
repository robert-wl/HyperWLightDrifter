let audioVisualizer: AudioVisualizer;
let audioSlider: HTMLInputElement;

$(document).ready(() => {
    navbarHandler();
    parallaxHandler();
    carouselHandler();
    onLoadAnimationHandler();
    cursorHandler();
    mapBossHandler();
    audioSlider = $('.slider')[0] as HTMLInputElement;
    // audioVisualizer = new AudioVisualizer('../assets/web/audio/audio8.mp3', audioSlider);
    audioHandler();
});

//test

function carouselHandler() {
    $('.arrow-right').on('click', () => {
        const carousel = $('.inner-container-carousel');
        const current = carousel.find('.active');
        const next = current.next();

        if (next.length === 0) {
            current.removeClass('active');
            carousel[0].children[1].classList.add('active');
            return;
        }

        current.removeClass('active');
        next.addClass('active');
    });

    $('.arrow-left').on('click', () => {
        const carousel = $('.inner-container-carousel');
        const current = carousel.find('.active');
        const prev = current.prev();

        if (prev.prev().length === 0) {
            current.removeClass('active');
            carousel[0].children[4].classList.add('active');
            return;
        }

        current.removeClass('active');
        prev.addClass('active');
    });

    $('.first-carousel').on('click', () => {
        const carousel = $('.inner-container-carousel');
        const current = carousel.find('.active');
        const next = carousel[0].children[1];

        current.removeClass('active');
        next.classList.add('active');
    });

    $('.second-carousel').on('click', () => {
        const carousel = $('.inner-container-carousel');
        const current = carousel.find('.active');
        const next = carousel[0].children[2];

        current.removeClass('active');
        next.classList.add('active');
    });

    $('.third-carousel').on('click', () => {
        const carousel = $('.inner-container-carousel');
        const current = carousel.find('.active');
        const next = carousel[0].children[3];

        current.removeClass('active');
        next.classList.add('active');
    });

    $('.fourth-carousel').on('click', () => {
        const carousel = $('.inner-container-carousel');
        const current = carousel.find('.active');
        const next = carousel[0].children[4];

        current.removeClass('active');
        next.classList.add('active');
    });
}

function navbarHandler() {
    const navbar = $('#navbar');

    const body = $('body');
    body.on('scroll', () => {
        // console.log('hai');
        if (body.scrollTop()! > 700) {
            navbar.addClass('navbar-scrolled');
        } else {
            navbar.removeClass('navbar-scrolled');
        }
    });
}

function parallaxHandler() {
    $('body').on('scroll', () => {
        const scrollY = $('#scroll-body').scrollTop()!;

        if (scrollY < 3000) {
            return;
        }

        const constant = 4200 * (window.innerWidth / 1920);
        const parallaxVal = (scrollY - 4700) * 0.5;

        $('.image-cover')[0].style.transform = `translateY(${parallaxVal}px)`;
    });
}

function onLoadAnimationHandler() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    });

    const elements = document.querySelectorAll('section');
    elements.forEach((element) => observer.observe(element));
}

function cursorHandler() {
    const cursor = document.querySelector('.cursor');

    let yPos = 0;
    let xPos = 0;
    let bodyPos = 0;

    const body = $('body');
    document.addEventListener('mousemove', (e) => {
        // console.log(e.clientY + body.scrollTop()!, e.clientX);
        bodyPos = body.scrollTop()!;
        yPos = e.clientY + bodyPos;
        xPos = e.clientX - 10;
        cursor!.setAttribute('style', `top: ${yPos}px; left: ${xPos}px;`);
    });
    //
    document.querySelector('body')!.addEventListener('scroll', (e) => {
        cursor!.setAttribute('style', `top: ${yPos - (bodyPos - body.scrollTop()!)}px; left: ${xPos}px;`);
    });

    const iframe = document.querySelector('iframe')!;

    iframe.contentWindow!.addEventListener('mousemove', (e) => {
        // console.log(e.clientY + body.scrollTop()!, e.clientX);
        bodyPos = body.scrollTop()!;
        yPos = e.clientY + bodyPos;
        xPos = e.clientX - 10;
        cursor!.setAttribute('style', `top: ${yPos}px; left: ${xPos}px;`);
    });
    //
    iframe.contentWindow!.addEventListener('scroll', (e) => {
        cursor!.setAttribute('style', `top: ${yPos - (bodyPos - body.scrollTop()!)}px; left: ${xPos}px;`);
    });
}

function mapBossHandler() {
    const markers = $('.boss-marker');
    const bossImages = $('.boss-image');

    for (const marker of markers) {
        marker.getElementsByClassName('skull')[0].addEventListener('click', () => {
            const current = marker.getElementsByClassName('boss-image')[0];

            if (!current.classList.contains('hidden')) {
                bossImages.addClass('hidden');
                return;
            }

            bossImages.addClass('hidden');
            current.classList.remove('hidden');
        });
    }
}

class AudioVisualizer {
    private readonly audio: HTMLAudioElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly analyser: AnalyserNode;
    private readonly bufferLength: number;
    private readonly dataArray: Uint8Array;
    private readonly barWidth: number;

    constructor(source: string, slider: HTMLInputElement) {
        this.audio = new Audio(source);

        this.canvas = $('#audio-visualizer')[0] as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;

        const audioCtx = new window.AudioContext();
        let audioSource;

        audioSource = audioCtx.createMediaElementSource(this.audio);
        this.analyser = audioCtx.createAnalyser();
        audioSource.connect(this.analyser);
        this.analyser.connect(audioCtx.destination);

        this.analyser.fftSize = Math.pow(2, 9);
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.barWidth = this.canvas.width / (this.bufferLength * 2);

        this.audio.addEventListener('timeupdate', () => {
            const newPosition = (this.audio.currentTime / this.audio.duration) * 100;
            slider.value = String(newPosition);
        });

        slider.addEventListener('input', () => {
            this.audio.currentTime = (Number(slider.value) / 100) * this.audio.duration;
            isPlaying = true;
            this.playAudio();
        });

        this.animate();
    }

    public playAudio() {
        this.audio.play().then();
    }

    public pauseAudio() {
        this.audio.pause();
    }

    private animate() {
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

    private getColor(barHeight: number, i: number) {
        const red = barHeight + 25 * (i / this.bufferLength);
        const green = 250 * (i / this.bufferLength);
        const blue = 50;

        return { red, green, blue };
    }
}

let isPlaying = false;

function audioHandler() {
    $('.audio-toggle-button').on('click', () => {
        for (const button of $('.audio-toggle-button')) {
            button.classList.toggle('disabled');
        }
        isPlaying = !isPlaying;

        if (isPlaying) {
            audioVisualizer.playAudio();
            return;
        }
        audioVisualizer.pauseAudio();
    });
}
