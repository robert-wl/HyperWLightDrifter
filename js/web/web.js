import AudioVisualizer from './AudioVisualizer.js';
import AudioPlayer from './AudioPlayer.js';
$(() => {
    navbarHandler();
    iframeHandler();
    jumbotronHandler();
    parallaxHandler();
    carouselHandler();
    onLoadAnimationHandler();
    cursorHandler();
    mapBossHandler();
    const audioSlider = $('.slider')[0];
    const audioToggleButton = $('.audio-toggle-button').toArray();
    let player = null;
    $(document).on('click', () => {
        if (!player) {
            player = new AudioPlayer({
                audioVisualizer: new AudioVisualizer({
                    source: '../assets/web/ost/audio.mp3',
                }),
                audioSlider: audioSlider,
                audioToggleButton: audioToggleButton,
            });
        }
    });
});
function iframeHandler() {
    $(document).on('click', () => {
        $('#iframe').css('pointer-events', 'auto');
        setTimeout(() => {
            $('#iframe').css('pointer-events', 'none');
        }, 1000);
    });
}
function jumbotronHandler() {
    $(document).on('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const screenCenterX = window.innerWidth / 2;
        const relativeX = mouseX - screenCenterX;
        const relativeY = mouseY - 300;
        $('#jumbotron-image-back').css('transform', `translate(${-relativeX / 60}px, ${-relativeY / 60}px) scale(1.1)`);
        $('#jumbotron-image-middle').css('transform', `translate(${-relativeX / 20}px, ${-relativeY / 20}px) scale(1.1)`);
        $('#jumbotron-image-front').css('transform', `translate(${-relativeX / 5}px, ${-50 - relativeY / 5}px) scale(1.1)`);
    });
}
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
        }
        else {
            navbar.removeClass('navbar-scrolled');
        }
    });
}
function parallaxHandler() {
    $(document).on('scroll', () => {
        const scrollY = document.documentElement.scrollTop;
        if (scrollY < 3000) {
            return;
        }
        // const constant = 4200 * (window.innerWidth / 1920);
        const parallaxVal = (scrollY - 4600) * 0.5;
        $('.image-cover')[0].style.transform = `translateY(${parallaxVal}px)`;
    });
}
function onLoadAnimationHandler() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
            else {
                entry.target.classList.remove('visible');
            }
        });
    });
    const elements = document.querySelectorAll('section');
    elements.forEach((element) => observer.observe(element));
}
function cursorHandler() {
    let yPos = 0;
    let xPos = 0;
    $(document).on('mousemove', (e) => {
        const documentTop = $(document).scrollTop();
        yPos = e.clientY;
        xPos = e.clientX - 25;
        $('#cursor')
            .css('top', `${yPos + documentTop}px`)
            .css('left', `${xPos}px`);
    });
    $(document).on('scroll', () => {
        $('#cursor')
            .css('top', `${yPos + $(document).scrollTop()}px`)
            .css('left', `${xPos}px`);
    });
    $('.pointer')
        .on('mouseenter', () => {
        $('#cursor').css('animation', 'cursorPointerAnimation 1s ease-in-out infinite');
    })
        .on('mouseleave', () => {
        $('#cursor').css('animation', 'cursorAnimation 1s ease-in-out infinite');
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
