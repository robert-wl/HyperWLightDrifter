import Game from '../Game/Game.js';
import GameSettings from '../../constants.js';
import { getHorizontalValue, getVerticalValue } from '../../helper/distanceHelper.js';
import CameraBox from './CameraBox.js';
import CameraNormalState from './state/CameraNormalState.js';
import CameraFollowState from './state/CameraFollowState.js';

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
        this.cameraBox = new CameraBox();
        this.lowerLayers = new Map();
        this.upperLayers = Game.getInstance().objects;
        this.shakeDuration = {
            x: 0,
            y: 0,
        };
        this.shakeStartTime = -1;
        this.translateOffset = {
            x: 0,
            y: 0,
        };
        this.hasTranslated = false;
        this.snapBackToPlayer = false;
        this.followTarget = null;
        this.normalState = new CameraNormalState();
        this.followState = new CameraFollowState();
        this.currState = this.normalState;
    }

    init(lowerLayer) {
        if (lowerLayer) {
            this.lowerLayers = lowerLayer;
        }
        this.position.x = 0;
        this.position.y = 0;
        this.width = GameSettings.GAME.SCREEN_WIDTH;
        this.height = GameSettings.GAME.SCREEN_HEIGHT;
    }

    switchState(nextState) {
        this.currState.exitState();
        this.currState = nextState;
        this.currState.enterState();
    }

    getCameraSides() {
        console.log({
            top: this.position.y,
            bottom: this.position.y + this.height / 2,
            left: this.position.x,
            right: this.position.x + this.width / 2,
        });
        return {
            top: this.position.y,
            bottom: this.position.y + this.height / 2,
            left: this.position.x,
            right: this.position.x + this.width / 2,
        };
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

    moveCameraPosition({ direction }) {
        // const directionArr = this.cameraBox.getOverlap();
        // this.translateCamera({
        //     direction: directionArr,
        //     moveDirection: direction,
        // });
    }

    setSnapBackToPlayer() {
        this.snapBackToPlayer = true;
    }

    setShakeCamera({ duration, angle = Math.PI / 2, strength = 3 }) {
        this.shakeStrength = strength;
        this.shakeDuration = duration;
        this.shakeAngle = angle;
        this.shakeStartTime = Date.now();
    }

    shakeCamera() {
        if (this.shakeStartTime === -1) {
            this.translateOffset = {
                x: 0,
                y: 0,
            };

            return;
        }

        const tDiff = Date.now() - this.shakeStartTime;
        if (tDiff > this.shakeDuration) {
            this.shakeStartTime = -1;

            return;
        }

        const easing = Math.pow(tDiff / this.shakeDuration - 1, 3) + 1;

        this.translateOffset.x =
            (Math.sin(tDiff * 0.05) + Math.sin(tDiff * 0.057113)) *
            this.shakeStrength *
            getHorizontalValue({
                magnitude: easing,
                angle: this.shakeAngle,
            });
        this.translateOffset.y =
            (Math.sin(tDiff * 0.05) + Math.sin(tDiff * 0.057113)) *
            this.shakeStrength *
            getVerticalValue({
                magnitude: easing,
                angle: this.shakeAngle,
            });

        const { ctx } = Game.getInstance();
        ctx.translate(this.translateOffset.x, this.translateOffset.y);
        this.hasTranslated = true;
    }

    resetShakeCamera() {
        if (this.shakeStartTime === -1 || !this.hasTranslated) {
            return;
        }

        const { ctx } = Game.getInstance();
        ctx.translate(-this.translateOffset.x, -this.translateOffset.y);
        this.hasTranslated = false;
    }

    clear(ctx) {
        const { canvas } = Game.getInstance();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    updateCamera() {
        this.currState.updateState(this);
    }

    renderLowerBackground() {
        this.currState.renderLowerLayer(this);
    }

    renderTopBackground() {
        this.currState.renderUpperLayer(this);
    }

    translateCamera({ direction, moveDirection }) {
        const { player, ctx } = Game.getInstance();

        if (direction.includes('d')) {
            const displacement = moveDirection?.x || Math.abs(player.velocity.x);
            ctx.translate(-displacement, 0);
            this.position.x += displacement;
        }
        if (direction.includes('a')) {
            const displacement = moveDirection?.x || Math.abs(player.velocity.x);
            ctx.translate(displacement, 0);
            // console.log(displacement);
            this.position.x -= displacement;
        }
        if (direction.includes('w')) {
            const displacement = moveDirection?.y || Math.abs(player.velocity.y);
            ctx.translate(0, displacement);
            this.position.y -= displacement;
        }
        if (direction.includes('s')) {
            const displacement = moveDirection?.y || Math.abs(player.velocity.y);
            ctx.translate(0, -displacement);
            this.position.y += displacement;
        }
    }

    moveCamera() {
        this.translateCamera({
            direction: this.cameraBox.getOverlap(this.getCameraSides()),
        });
    }
}
