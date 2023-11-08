import Game from '../game/Game.js';
import GameSettings from '../../constants.js';
import { getHorizontalValue, getManhattanDistance, getVerticalValue } from '../../helper/distanceHelper.js';
import CameraBox from './CameraBox.js';
import CameraNormalState from './state/CameraNormalState.js';
import CameraFollowState from './state/CameraFollowState.js';
import { drawImage, drawImageFromBottom } from '../../helper/renderer/drawer.js';
import CrystalSpider from '../enemy/crystalSpider/CrystalSpider.js';
import CrystalBrute from '../enemy/crystalBrute/CrystalBrute.js';
import Medkit from '../interactables/Medkit.js';
import Key from '../interactables/Key.js';
import Elevator from '../interactables/Elevator/Elevator.js';
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
        this.shakeDuration = 0;
        this.shakeStartTime = -1;
        this.shakeStrength = 0;
        this.shakeAngle = 0;
        this.translateOffset = {
            x: 0,
            y: 0,
        };
        this.hasTranslated = false;
        this.screenSize = GameSettings.GAME.SCREEN_WIDTH;
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
        this.currState.exitState(this);
        this.currState = nextState;
        this.currState.enterState(this);
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
    updateCamera() {
        this.currState.updateState(this);
    }
    renderLowerBackground() {
        this.renderLowerLayer();
    }
    renderTopBackground() {
        this.renderUpperLayer();
    }
    moveCamera() {
        this.translateCamera(this.cameraBox.getOverlap(this.getCameraSides()));
    }
    renderLowerLayer() {
        const { GAME_SCALE } = GameSettings.GAME;
        this.lowerLayers.forEach((background, positionStr) => {
            const position = {
                x: Number(positionStr.split(',')[0]) * (background.width - 1) * GAME_SCALE,
                y: Number(positionStr.split(',')[1]) * (background.height - 1) * GAME_SCALE,
            };
            if (!this.isInScreen(position)) {
                return;
            }
            drawImage({
                img: background,
                x: position.x,
                y: position.y,
                width: background.width * GAME_SCALE,
                height: background.height * GAME_SCALE,
            });
        });
    }
    renderUpperLayer() {
        let hasUpdatedPlayer = false;
        const { player } = Game.getInstance();
        const { GAME_SCALE } = GameSettings.GAME;
        const { objects, colliders } = this.getObjects();
        const interactables = [];
        const elevators = [];
        objects.forEach((piece) => {
            if (this.checkEntity(piece)) {
                piece.update();
                return;
            }
            if (this.checkInteractables(piece)) {
                piece.update();
                interactables.push(piece);
                return;
            }
            if (this.checkElevator(piece)) {
                elevators.push(piece);
                interactables.push(piece);
                return;
            }
            const { image, position, flipped } = piece;
            if (!hasUpdatedPlayer) {
                hasUpdatedPlayer = this.updatePlayer(position.y, colliders);
            }
            drawImageFromBottom({
                img: image,
                x: position.x,
                y: position.y,
                width: image.width * GAME_SCALE,
                height: image.height * GAME_SCALE,
                mirrored: flipped,
            });
        });
        Game.getInstance().interactablesManager.interactablesList = interactables;
        Game.getInstance().elevators = elevators;
        if (!hasUpdatedPlayer && player.currState !== player.inElevatorState) {
            player.updateState(colliders);
        }
    }
    getObjects() {
        const { player, enemyManager, coins } = Game.getInstance();
        const { GAME_SCALE, FOREST_STAGE } = GameSettings.GAME;
        const objects = [];
        const colliders = [];
        const enemyList = enemyManager.enemyList;
        this.upperLayers.forEach((object, positionStr) => {
            const position = {
                y: Number(positionStr.split(',')[0]) * FOREST_STAGE.FLOOR_WIDTH * GAME_SCALE,
                x: Number(positionStr.split(',')[1]) * FOREST_STAGE.FLOOR_WIDTH * GAME_SCALE,
            };
            if (!this.isInScreen(position)) {
                return;
            }
            object.pieces.forEach((piece) => {
                if (!('collider' in piece)) {
                    objects.push(piece);
                    return;
                }
                const collider = piece.collider;
                if (collider == null) {
                    objects.push(piece);
                    return;
                }
                const distance = getManhattanDistance({
                    x: collider.x - player.centerPosition.x,
                    y: collider.y - player.centerPosition.y,
                });
                if (distance < 300) {
                    colliders.push(collider);
                }
                objects.push(piece);
            });
        });
        // @ts-ignore
        objects.push(...enemyList);
        objects.sort((pieceOne, pieceTwo) => {
            let positionOne = pieceOne.position.y;
            let positionTwo = pieceTwo.position.y;
            if (this.checkEntity(pieceOne) && 'height' in pieceOne) {
                positionOne += pieceOne.height / 2;
            }
            if (this.checkEntity(pieceTwo) && 'height' in pieceTwo) {
                positionTwo += pieceTwo.height / 2;
            }
            return positionOne - positionTwo;
        });
        objects.push(...coins);
        return { objects, colliders };
    }
    isInScreen(position) {
        const { currState, stageTwoState } = Game.getInstance();
        if (currState === stageTwoState) {
            return true;
        }
        if (position.x > this.position.x + this.screenSize / 2 || position.x < this.position.x - this.screenSize / 2) {
            return false;
        }
        return !(position.y > this.position.y + this.screenSize / 2 || position.y < this.position.y - this.screenSize / 2);
    }
    checkEntity(object) {
        return object instanceof CrystalSpider || object instanceof CrystalBrute;
    }
    checkInteractables(object) {
        return object instanceof Medkit || object instanceof Key;
    }
    checkElevator(object) {
        return object instanceof Elevator;
    }
    updatePlayer(yAbsPosition, colliders) {
        const { player } = Game.getInstance();
        if (player.currState === player.inElevatorState) {
            return false;
        }
        const { centerPosition, height } = player;
        const playerY = centerPosition.y + height;
        if (yAbsPosition < playerY) {
            return false;
        }
        player.updateState(colliders);
        return true;
    }
    getCameraSides() {
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
    translateCamera(direction, moveDirection) {
        const { player, ctx } = Game.getInstance();
        if (direction.includes('d')) {
            const displacement = (moveDirection === null || moveDirection === void 0 ? void 0 : moveDirection.x) || Math.abs(player.velocity.x);
            ctx.translate(-displacement, 0);
            this.position.x += displacement;
        }
        if (direction.includes('a')) {
            const displacement = (moveDirection === null || moveDirection === void 0 ? void 0 : moveDirection.x) || Math.abs(player.velocity.x);
            ctx.translate(displacement, 0);
            this.position.x -= displacement;
        }
        if (direction.includes('w')) {
            const displacement = (moveDirection === null || moveDirection === void 0 ? void 0 : moveDirection.y) || Math.abs(player.velocity.y);
            ctx.translate(0, displacement);
            this.position.y -= displacement;
        }
        if (direction.includes('s')) {
            const displacement = (moveDirection === null || moveDirection === void 0 ? void 0 : moveDirection.y) || Math.abs(player.velocity.y);
            ctx.translate(0, -displacement);
            this.position.y += displacement;
        }
    }
}
