import AudioVisualizer from './AudioVisualizer.js';
import AudioPlayer from './AudioPlayer.js';

$(() => {
    navbarHandler();
    parallaxHandler();
    carouselHandler();
    onLoadAnimationHandler();
    cursorHandler();
    mapBossHandler();

    const audioSlider = $('.slider')[0] as HTMLInputElement;
    const audioToggleButton = $('.audio-toggle-button').toArray() as HTMLElement[];

    new AudioPlayer({
        audioVisualizer: new AudioVisualizer({
            source: '../assets/web/ost/audio.mp3',
        }),
        audioSlider: audioSlider,
        audioToggleButton: audioToggleButton,
    });
});

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

    $(document).on('scroll', () => {
        if (document.documentElement.scrollTop > 700) {
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

        // const constant = 4200 * (window.innerWidth / 1920);
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

    let documentTop = 0;
    let yPos = 0;
    let xPos = 0;

    const body = $('body');
    document.addEventListener('mousemove', (e) => {
        documentTop = document.documentElement.scrollTop;
        yPos = e.clientY;
        xPos = e.clientX - 10;
        cursor!.setAttribute('style', `top: ${yPos + documentTop}px; left: ${xPos}px;`);
    });

    document.addEventListener('scroll', () => {
        cursor!.setAttribute('style', `top: ${yPos + document.documentElement.scrollTop}px; left: ${xPos}px;`);
    });

    const iframe = document.querySelector('iframe')!;

    // iframe.contentWindow!.addEventListener('mousemove', (e) => {
    //     // console.log(e.clientY + body.scrollTop()!, e.clientX);
    //     bodyPos = body.scrollTop()!;
    //     yPos = e.clientY + bodyPos;
    //     xPos = e.clientX - 10;
    //     cursor!.setAttribute('style', `top: ${yPos}px; left: ${xPos}px;`);
    // });
    // //
    // iframe.contentWindow!.addEventListener('scroll', () => {
    //     cursor!.setAttribute('style', `top: ${yPos - (bodyPos - body.scrollTop()!)}px; left: ${xPos}px;`);
    // });
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
