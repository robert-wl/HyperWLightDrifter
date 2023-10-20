import Game from '../Game/Game.js';

export default class EndingVideo {
    static video = $('#ending-screen');

    static handleClose() {
        this.video.on('ended', () => {
            const { startState } = Game.getInstance();
            Game.getInstance().switchState(startState);
        });
    }

    static open() {
        this.video.css('display', 'flex').css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%');
        this.video.get(0).play();
    }

    static close() {
        this.video.css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%').css('display', 'none');
        this.video.get(0).pause();
        this.video.get(0).currentTime = 0;
    }
}
