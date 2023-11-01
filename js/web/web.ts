$(document).ready(() => {
    navbarHandler();
    parallaxHandler();
    carouselHandler();
});

// new AudioVisualizer({
// source: '../assets/web/audio/audio8.mp3',
// });

//test

function carouselHandler() {
    $('.arrow-right').on('click', () => {
        const carousel = $('.inner-container');
        const current = carousel.find('.active');
        const next = current.next();

        console.log(carousel.length);
        if (next.length === 0) {
            return;
        }

        current.removeClass('active');
        next.addClass('active');
    });

    $('.arrow-left').on('click', () => {
        const carousel = $('.inner-container');
        const current = carousel.find('.active');
        const prev = current.prev();

        if (prev.prev().length === 0) {
            return;
        }

        current.removeClass('active');
        prev.addClass('active');
    });
}

function navbarHandler() {
    const navbar = $('#navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 700) {
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
