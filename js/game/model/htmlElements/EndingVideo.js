export default class EndingVideo {
    constructor(eventEmitter) {
        this.video = $('#ending-screen');
        this.eventFunction = ({ event }) => {
            if (event === 'endingVideo:open') {
                this.open();
                return;
            }
            if (event === 'endingVideo:close') {
                this.close();
                return;
            }
        };
        this.eventEmitter = eventEmitter;
        this.eventHandler();
        this.handleClose();
    }
    handleClose() {
        this.video
            .off()
            .on('ended', () => {
            this.eventEmitter.notify('finishGame');
            this.close();
        })
            .on('mousedown', () => {
            this.eventEmitter.notify('finishGame');
            this.close();
        });
    }
    open() {
        this.video.css('display', 'flex').css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%');
        this.video.get(0).play().then();
    }
    close() {
        this.video.css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%').css('display', 'none');
        this.video.get(0).pause();
        this.video.get(0).currentTime = 0;
    }
    eventHandler() {
        this.eventEmitter.unsubscribe(this.eventFunction);
        this.eventEmitter.subscribe(this.eventFunction);
    }
}
