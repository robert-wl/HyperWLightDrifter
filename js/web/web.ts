$(document).ready(() => {
    navbarHandler();
    parallaxHandler();
    carouselHandler();
    onLoadAnimationHandler();
});

// new AudioVisualizer({
// source: '../assets/web/audio/audio8.mp3',
// });

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
