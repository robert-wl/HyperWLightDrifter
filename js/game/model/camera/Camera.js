import Game from '../Game/Game.js';

const CAMERA_X_CONSTANT = -45;
const CAMERA_Y_CONSTANT = -25;
const SCREEN_WIDTH = 1920;
const SCREEN_HEIGHT = 1080;

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
            width: 900,
            height: 500,
        };
        this.lowerBackground = null;
        this.topBackground = null;
        this.offset = {
            x: 0,
            y: 0,
        };
        this.shakeOffset = {
            x: 0,
            y: 0,
        };
        this.shake = false;
    }
    setPosition({ position, canvas }) {
        canvas.translate(-(position.x - this.cameraBox.width / 2), -(position.y - this.cameraBox.height / 2));
        this.position.x += position.x - this.cameraBox.width / 2;
        this.position.y += position.y - this.cameraBox.height / 2;
    }
    move({ offset }) {
        this.offset = {
            x: offset.x,
            y: offset.y,
        };
    }
    shakeCamera({ offset }) {
        this.shake = true;
        this.shakeOffset.x = offset.x;
        this.shakeOffset.y = offset.y;
    }
    updateCamera() {
        const ctx = Game.getInstance().ctx;

        if (this.shake) {
            this.shake = false;
            this.offset.x += this.shakeOffset.x;
            this.offset.y += this.shakeOffset.y;
            this.position.y -= this.shakeOffset.y;
            this.position.x -= this.shakeOffset.x;
            ctx.translate(this.offset.x, this.offset.y);
        }
        if (this.offset.y > 0.001 || this.offset.x > 0.001 || this.offset.y < -0.001 || this.offset.x < -0.001) {
            const displacementX = this.offset.x * 0.1;
            const displacementY = this.offset.y * 0.1;
            this.offset.x -= displacementX;
            this.offset.y -= displacementY;
            this.position.x += displacementX;
            this.position.y += displacementY;
            ctx.translate(-displacementX, -displacementY);
        }

        if (this.lowerBackground) {
            this.moveCamera();
            this.renderLowerBackground();
            this.width = this.lowerBackground.width / 2;
            this.height = this.lowerBackground.height / 2;
        }
        const player = Game.getInstance().player;
        this.cameraBox.position.x = player.position.x - (this.cameraBox.width / 2 + CAMERA_X_CONSTANT);
        this.cameraBox.position.y = player.position.y - (this.cameraBox.height / 2 + CAMERA_Y_CONSTANT);
        // this.cameraBox.position.x += this.offset.x;
        // this.cameraBox.position.y += this.offset.y;
        //
        // this.offset.x *= 0.9;
        // this.offset.y *= 0.9;

        if (Game.getInstance().debug) {
            this.renderDebugBox();
        }
    }

    renderDebugBox() {
        Game.getInstance().ctx.fillStyle = 'rgb(255, 0, 0, 0.5)';
        Game.getInstance().ctx.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);
    }
    renderLowerBackground() {
        Game.getInstance().ctx.drawImage(this.lowerBackground, this.position.x / 2 - this.offset.x, this.position.y / 2 - this.offset.y, this.width + this.offset.x, this.height + this.offset.y, this.position.x - Math.abs(this.offset.x), this.position.y - Math.abs(this.offset.y), SCREEN_WIDTH / 2 + Math.abs(this.offset.x), this.lowerBackground.height + Math.abs(this.offset.y));
    }

    renderTopBackground() {
        if (!this.topBackground) {
            return;
        }
        Game.getInstance().ctx.drawImage(this.topBackground, this.position.x / 2 - this.offset.x, this.position.y / 2 - this.offset.y, this.width + this.offset.x, this.height + this.offset.y, this.position.x - Math.abs(this.offset.x), this.position.y - Math.abs(this.offset.y), SCREEN_WIDTH / 2 + Math.abs(this.offset.x), this.topBackground.height + Math.abs(this.offset.y));
    }

    moveCamera() {
        const { ctx, player } = Game.getInstance();

        const cameraBoxRight = this.cameraBox.position.x + this.cameraBox.width;
        if (cameraBoxRight > this.position.x + this.lowerBackground.width && cameraBoxRight < Game.getInstance().width - 200) {
            const displacement = Math.abs(player.direction.x);
            ctx.translate(-displacement, 0);
            this.position.x += displacement;
        }

        const cameraBoxLeft = this.cameraBox.position.x;
        if (cameraBoxLeft < this.position.x && cameraBoxLeft > 100) {
            const displacement = Math.abs(player.direction.x);
            ctx.translate(displacement, 0);
            this.position.x -= displacement;
        }

        const cameraBoxBottom = this.cameraBox.position.y + this.cameraBox.height;
        if (cameraBoxBottom > this.position.y + 550 && cameraBoxBottom < Game.getInstance().height * 2) {
            const displacement = Math.abs(player.direction.y);
            ctx.translate(0, -displacement);
            this.position.y += displacement;
        }

        const cameraBoxTop = this.cameraBox.position.y;
        if (cameraBoxTop < this.position.y && cameraBoxTop > 0) {
            const displacement = Math.abs(player.direction.y);
            ctx.translate(0, displacement);
            this.position.y -= displacement;
        }
    }
}
