import Observable from '../utility/Observable.js';

export default class EndingVideo {
    protected video: JQuery<HTMLVideoElement> = $('#ending-screen');
    private eventEmitter: Observable;

    public constructor(eventEmitter: Observable) {
        this.eventEmitter = eventEmitter;

        this.eventHandler();
        this.handleClose();
    }

    public handleClose() {
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

    public open() {
        this.video.css('display', 'flex').css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%');
        this.video.get(0)!.play().then();
    }

    public close() {
        this.video.css('animation', 'fadeIn 0.25s ease-in-out').css('opacity', '100%').css('display', 'none');
        this.video.get(0)!.pause();
        this.video.get(0)!.currentTime = 0;
    }

    private eventFunction = ({ event }) => {
        if (event === 'endingVideo:open') {
            this.open();
            return;
        }
        if (event === 'endingVideo:close') {
            this.close();
            return;
        }
    };

    private eventHandler() {
        this.eventEmitter.unsubscribe(this.eventFunction);
        this.eventEmitter.subscribe(this.eventFunction);
    }
}
