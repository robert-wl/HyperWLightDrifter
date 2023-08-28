import Game from '../Game.js';

const CAMERA_X_CONSTANT = -45;
const CAMERA_Y_CONSTANT = -25;

export default class Camera {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
        };
        this.width = 0;
        this.height = 0;
        this.cameraBox = {
            position: {
                x: 0,
                y: 0,
            },
            width: 800,
            height: 500,
        };
        this.background = null;
    }

    setPosition({ position, canvas }) {
        canvas.translate(-(position.x - this.cameraBox.width / 2), -(position.y - this.cameraBox.height / 2));
        this.position.x += position.x - this.cameraBox.width / 2;
        this.position.y += position.y - this.cameraBox.height / 2;
    }

    updateCamera() {
        if (this.background) {
            this.moveCamera();
            this.renderBackground();
            this.width = this.background.width / 2;
            this.height = this.background.height / 2;
        }
        const player = Game.getInstance().player;
        this.cameraBox.position.x = player.position.x - (this.cameraBox.width / 2 + CAMERA_X_CONSTANT);
        this.cameraBox.position.y = player.position.y - (this.cameraBox.height / 2 + CAMERA_Y_CONSTANT);

        if (Game.getInstance().debug) {
            this.renderDebugBox();
        }
    }

    renderDebugBox() {
        const canvasCtx = Game.getInstance().canvasCtx;
        canvasCtx.fillStyle = 'rgb(255, 0, 0, 0.5)';
        canvasCtx.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);
    }
    renderBackground() {
        const canvasCtx = Game.getInstance().canvasCtx;
        canvasCtx.drawImage(
            this.background,
            this.position.x / 2,
            this.position.y / 2,
            this.width,
            this.height,
            this.position.x,
            this.position.y,
            this.background.width,
            this.background.height
        );
        // canvasCtx.drawImage(this.background, this.position.x, this.position.y, this.background.width * CAMERA_SCALE, this.background.height * CAMERA_SCALE);
    }

    moveCamera() {
        const { canvasCtx, player } = Game.getInstance();

        const cameraBoxRight = this.cameraBox.position.x + this.cameraBox.width;
        if (cameraBoxRight > this.position.x + this.background.width && cameraBoxRight < Game.getInstance().width - 200) {
            const displacement = Math.abs(player.direction.x);
            canvasCtx.translate(-displacement, 0);
            this.position.x += displacement;
        }

        const cameraBoxLeft = this.cameraBox.position.x;
        if (cameraBoxLeft < this.position.x && cameraBoxLeft > 100) {
            const displacement = Math.abs(player.direction.x);
            canvasCtx.translate(displacement, 0);
            this.position.x -= displacement;
        }

        const cameraBoxBottom = this.cameraBox.position.y + this.cameraBox.height;
        if (cameraBoxBottom > this.position.y + 550 && cameraBoxBottom < Game.getInstance().height * 2) {
            const displacement = Math.abs(player.direction.y);
            canvasCtx.translate(0, -displacement);
            this.position.y += displacement;
        }

        const cameraBoxTop = this.cameraBox.position.y;
        if (cameraBoxTop < this.position.y && cameraBoxTop > 0) {
            const displacement = Math.abs(player.direction.y);
            canvasCtx.translate(0, displacement);
            this.position.y -= displacement;
        }
    }
}
