import Game from '../Game/Game.js';
import GameSettings from '../../constants.js';
import {getHorizontalValue, getMagnitudeValue, getVerticalValue} from "../../helper/distanceHelper.js";
import {getAngle} from "../../helper/angleHelper.js";

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
        this.shakeDuration = {
            x: 0,
            y: 0,
        }
        this.shakeStartTime = -1;
        this.translateOffset = {
            x: 0,
            y: 0,
        }
    }

    init({ lowerBackground, topBackground }) {
        this.lowerBackground = lowerBackground;
        this.topBackground = topBackground;
        this.width = lowerBackground.width / 2;
        this.height = lowerBackground.height / 2;
    }

    getTranslatePosition({ position, length }) {
        return position - length;
    }
    setCameraPosition({ position }) {
        const { ctx } = Game.getInstance();

        const translateX = this.getTranslatePosition({
            position: position.x,
            length: this.cameraBox.width / 2,
        });
        const translateY = this.getTranslatePosition({
            position: position.y,
            length: this.cameraBox.height / 2,
        });

        ctx.translate(-translateX, -translateY);
        this.position.x += translateX;
        this.position.y += translateY;
    }
    move({ offset }) {
        this.offset = {
            x: offset.x,
            y: offset.y,
        };
    }

    setShakeCamera({ durationX = 0, durationY = 0 }) {
        this.shakeDuration = {
            x: durationX,
            y: durationY,
        };
        this.shakeStartTime = Date.now();
    }

    shakeCamera(){
        if(this.shakeStartTime === -1) {
            return;
        }

        const tDiff = Date.now() - this.shakeStartTime;
        if(tDiff > this.shakeDuration.x && tDiff > this.shakeDuration.y) {
            this.shakeStartTime = -1;
            return;
        }

        const magnitude = getMagnitudeValue({
            x: this.shakeDuration.x,
            y: this.shakeDuration.y,
        });
        const angle = getAngle({
            x: this.shakeDuration.x,
            y: this.shakeDuration.y,
        })

        const easing = Math.pow((tDiff / magnitude) - 1,3) + 1;

        const { ctx } = Game.getInstance();
        ctx.save();

        this.translateOffset.x = (Math.cos(tDiff*0.1 ) + Math.cos( tDiff *0.3115))*15 * getHorizontalValue({
            magnitude: easing,
            angle: angle,
        });
        this.translateOffset.y = (Math.sin(tDiff*0.05) + Math.sin(tDiff*0.057113))*15 * getVerticalValue({
            magnitude: easing,
            angle: angle,
        });
        ctx.translate(this.translateOffset.x, this.translateOffset.y);

    }

    resetShakeCamera() {
        const { ctx } = Game.getInstance();
        ctx.restore();
    }

    updateCamera() {
        this.moveCamera();


        const { player } = Game.getInstance();
        this.cameraBox.position.x = this.getTranslatePosition({
            position: player.centerPosition.x,
            length: this.cameraBox.width / 2 + CAMERA_X_CONSTANT,
        });
        this.cameraBox.position.y = this.getTranslatePosition({
            position: player.centerPosition.y,
            length: this.cameraBox.height / 2 + CAMERA_Y_CONSTANT,
        });

        if (Game.getInstance().debug) {
            this.renderDebugBox();
        }
    }

    renderDebugBox() {
        const { ctx } = Game.getInstance();

        ctx.fillStyle = GameSettings.DEBUG.COLOR.CAMERA_BOX;
        ctx.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);
    }
    renderLowerBackground() {
        this.drawCamera({
            img: this.lowerBackground,
            imageTopLeft: {
                x: this.position.x / 2 - this.translateOffset.x,
                y: this.position.y / 2 - this.translateOffset.y,
            },
            imageSelectSize: {
                x: this.width + this.translateOffset.x,
                y: this.height + this.translateOffset.y,
            },
            imagePosition: {
                x: this.position.x - Math.abs(this.translateOffset.x),
                y: this.position.y - Math.abs(this.translateOffset.y),
            },
            imageCanvasSize: {
                x: SCREEN_WIDTH / 2 + Math.abs(this.translateOffset.x),
                y: this.lowerBackground.height + Math.abs(this.translateOffset.y),
            },
        });
    }

    renderTopBackground() {
        if (!this.topBackground) {
            return;
        }

        this.drawCamera({
            img: this.topBackground,
            imageTopLeft: {
                x: this.position.x / 2 - this.translateOffset.x,
                y: this.position.y / 2 - this.translateOffset.y,
            },
            imageSelectSize: {
                x: this.width + this.translateOffset.x,
                y: this.height + this.translateOffset.y,
            },
            imagePosition: {
                x: this.position.x - Math.abs(this.translateOffset.x),
                y: this.position.y - Math.abs(this.translateOffset.y),
            },
            imageCanvasSize: {
                x: SCREEN_WIDTH / 2 + Math.abs(this.translateOffset.x),
                y: this.topBackground.height + Math.abs(this.translateOffset.y),
            },
        });
    }

    translateCamera({ direction }) {
        const { player, ctx } = Game.getInstance();

        if (direction.includes('d')) {
            const displacement = Math.abs(player.direction.x);
            ctx.translate(-displacement, 0);
            this.position.x += displacement;
        }
        if (direction.includes('a')) {
            const displacement = Math.abs(player.direction.x);
            ctx.translate(displacement, 0);
            this.position.x -= displacement;
        }
        if (direction.includes('w')) {
            const displacement = Math.abs(player.direction.y);
            ctx.translate(0, displacement);
            this.position.y -= displacement;
        }
        if (direction.includes('s')) {
            const displacement = Math.abs(player.direction.y);
            ctx.translate(0, -displacement);
            this.position.y += displacement;
        }
    }

    getCameraBoxOverlap() {
        const directionArray = [];
        const cameraBoxRight = this.cameraBox.position.x + this.cameraBox.width;
        if (cameraBoxRight > this.position.x + this.lowerBackground.width && cameraBoxRight < Game.getInstance().width - 200) {
            directionArray.push('d');
        }

        const cameraBoxLeft = this.cameraBox.position.x;
        if (cameraBoxLeft < this.position.x && cameraBoxLeft > 100) {
            directionArray.push('a');
        }

        const cameraBoxBottom = this.cameraBox.position.y + this.cameraBox.height;
        if (cameraBoxBottom > this.position.y + 550 && cameraBoxBottom < Game.getInstance().height * 2) {
            directionArray.push('s');
        }

        const cameraBoxTop = this.cameraBox.position.y;
        if (cameraBoxTop < this.position.y && cameraBoxTop > 0) {
            directionArray.push('w');
        }

        return directionArray;
    }

    moveCamera() {
        this.translateCamera({
            direction: this.getCameraBoxOverlap(),
        });
    }

    drawCamera({ img, imageTopLeft, imageSelectSize, imagePosition, imageCanvasSize }) {
        const { ctx } = Game.getInstance();
        ctx.drawImage(
            img,
            imageTopLeft.x,
            imageTopLeft.y,
            imageSelectSize.x,
            imageSelectSize.y,
            imagePosition.x,
            imagePosition.y,
            imageCanvasSize.x,
            imageCanvasSize.y
        );
    }
}
