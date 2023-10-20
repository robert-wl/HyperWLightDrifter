const navbar = $('#navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 700) {
        navbar.addClass('navbar-scrolled');
    } else {
        navbar.removeClass('navbar-scrolled');
    }
});
