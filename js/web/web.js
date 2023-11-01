const navbar = $('#navbar');

parallaxHandler();
window.addEventListener('scroll', () => {
    if (window.scrollY > 700) {
        navbar.addClass('navbar-scrolled');
    } else {
        navbar.removeClass('navbar-scrolled');
    }
});

function parallaxHandler() {
    $('body').on('scroll', () => {
        const scrollY = $('#scroll-body').scrollTop();

        console.log(scrollY);
        if (scrollY < 3000) {
            return;
        }
        console.log(scrollY, innerWidth);

        const constant = 4200 * (window.innerWidth / 1920);
        console.log(constant);
        const parallaxVal = (scrollY - 4500) * 0.5;

        $('.image-cover')[0].style.transform = `translateY(${parallaxVal}px)`;
    });
}
