export default class Navbar {
    protected static navbar = $('#navbar');

    static open() {
        this.navbar.css('display', 'flex').css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%');
    }

    static close() {
        this.navbar.css('display', 'none');
    }
}
