import Game from '../../Game/Game';

export default class ElevatorBottomBackground {
    constructor({ x, y, width, height }) {
        this.position = {
            x,
            y,
        };
        this.width = width;
        this.height = height;
    }

    update() {
        this.drawImage();
    }

    drawImage() {
        const { ctx } = Game.getInstance();
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
