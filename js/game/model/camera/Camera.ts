import Game from '../game/Game.js';
import GameSettings from '../../constants.js';
import CameraBox from './CameraBox.js';
import CameraNormalState from './state/CameraNormalState.js';
import CameraFollowState from './state/CameraFollowState.js';
import { Vector } from '../utility/interfaces/Vector.js';
import CameraBaseState from './state/CameraBaseState.js';
import CrystalSpider from '../enemy/crystalSpider/CrystalSpider.js';
import CrystalBrute from '../enemy/crystalBrute/CrystalBrute.js';
import Medkit from '../interactables/Medkit.js';
import Coin from '../interactables/Coin.js';
import Elevator from '../interactables/Elevator/Elevator.js';
import SetPiece from '../map/setPieces/SetPiece.js';
import { CombinedPiece } from '../utility/interfaces/Piece.js';
import Collider from '../collideable/Collider.js';
import DistanceHelper from '../utility/helper/DistanceHelper.js';
import { PolarVector } from '../utility/interfaces/PolarVector.js';
import DrawHelper from '../utility/helper/DrawHelper.js';
import { Box } from '../utility/interfaces/Box.js';

export default class Camera {
    public position: Vector;
    public width: number;
    public height: number;
    public cameraBox: CameraBox;
    public lowerLayers: Map<string, HTMLImageElement>;
    public upperLayers: Map<string, SetPiece>;
    public shakeDuration: number;
    public shakeStartTime: number;
    public shakeStrength: number;
    public shakeAngle: number;
    public translateOffset: Vector;
    public hasTranslated: boolean;
    public normalState: CameraNormalState;
    public followState: CameraFollowState;
    public currState: CameraBaseState;
    private readonly screenSize: number;
    private readonly game: Game;

    public constructor(game: Game) {
        this.game = game;
        this.position = Vector.Zero();
        this.width = 0;
        this.height = 0;
        this.cameraBox = new CameraBox(this.game);
        this.lowerLayers = new Map();
        this.upperLayers = game.objects;
        this.shakeDuration = 0;
        this.shakeStartTime = -1;
        this.shakeStrength = 0;
        this.shakeAngle = 0;
        this.translateOffset = Vector.Zero();
        this.hasTranslated = false;
        this.screenSize = GameSettings.GAME.SCREEN_WIDTH;
        this.normalState = new CameraNormalState();
        this.followState = new CameraFollowState();
        this.currState = this.normalState;
    }

    public init(lowerLayer?: Map<string, HTMLImageElement>) {
        if (lowerLayer) {
            this.lowerLayers = lowerLayer;
        }
        this.position.x = 0;
        this.position.y = 0;
        this.width = GameSettings.GAME.SCREEN_WIDTH;
        this.height = GameSettings.GAME.SCREEN_HEIGHT;
    }

    public switchState(nextState: CameraBaseState) {
        this.currState.exitState(this);
        this.currState = nextState;
        this.currState.enterState(this);
    }

    public setCameraPosition({ position }) {
        const translateX = this.getTranslatePosition({
            position: position.x,
            length: this.cameraBox.width / 2,
        });

        const translateY = this.getTranslatePosition({
            position: position.y,
            length: this.cameraBox.height / 2,
        });

        this.game.ctx.translate(-translateX, -translateY);

        this.position.x += translateX;
        this.position.y += translateY;
    }

    public setShakeCamera({ duration, angle = Math.PI / 2, strength = 3 }) {
        this.shakeStrength = strength;
        this.shakeDuration = duration;
        this.shakeAngle = angle;
        this.shakeStartTime = Date.now();
    }

    public shakeCamera() {
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
        const pVector = new PolarVector(easing, this.shakeAngle);

        this.translateOffset.x = (Math.sin(tDiff * 0.05) + Math.sin(tDiff * 0.057113)) * this.shakeStrength * DistanceHelper.getHorizontalValue(pVector);
        this.translateOffset.y = (Math.sin(tDiff * 0.05) + Math.sin(tDiff * 0.057113)) * this.shakeStrength * DistanceHelper.getVerticalValue(pVector);

        this.game.ctx.translate(this.translateOffset.x, this.translateOffset.y);
        this.hasTranslated = true;
    }

    public resetShakeCamera() {
        if (this.shakeStartTime === -1 || !this.hasTranslated) {
            return;
        }

        this.game.ctx.translate(-this.translateOffset.x, -this.translateOffset.y);
        this.hasTranslated = false;
    }

    public updateCamera() {
        this.currState.updateState(this);
    }

    public renderLowerBackground() {
        this.renderLowerLayer();
    }

    public renderTopBackground() {
        this.renderUpperLayer();
    }

    moveCamera() {
        this.translateCamera(this.cameraBox.getOverlap(this.getCameraSides()));
    }

    public renderLowerLayer() {
        const { GAME_SCALE } = GameSettings.GAME;
        this.lowerLayers.forEach((background, positionStr) => {
            const position = {
                x: Number(positionStr.split(',')[0]) * (background.width - 1) * GAME_SCALE,
                y: Number(positionStr.split(',')[1]) * (background.height - 1) * GAME_SCALE,
            };

            if (!this.isInScreen(position)) {
                return;
            }

            const imageSize = Box.parse({
                x: position.x,
                y: position.y,
                w: background.width * GAME_SCALE,
                h: background.height * GAME_SCALE,
            });

            DrawHelper.drawImage(background, imageSize);
        });
    }

    public renderUpperLayer() {
        let hasUpdatedPlayer = false;

        const { player } = this.game;
        const { GAME_SCALE } = GameSettings.GAME;

        const { objects, colliders } = this.getObjects();

        const interactables: (Medkit | Coin | Elevator)[] = [];
        const elevators: Elevator[] = [];

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

            const imageBox = Box.parse({
                x: position.x,
                y: position.y,
                w: image.width * GAME_SCALE,
                h: image.height * GAME_SCALE,
            });
            DrawHelper.drawImageFromBottom(image, imageBox, flipped);
        });

        this.game.interactablesManager!.interactablesList = interactables;
        this.game.elevators = elevators;
        if (!hasUpdatedPlayer && player!.currState !== player!.inElevatorState) {
            player!.updateState(colliders);
        }
    }

    public getObjects() {
        const { player, enemyManager, coins } = this.game;
        const { GAME_SCALE, FOREST_STAGE } = GameSettings.GAME;
        const objects: CombinedPiece[] = [];
        const colliders: Collider[] = [];
        const enemyList = enemyManager!.enemyList;

        this.upperLayers.forEach((object: SetPiece, positionStr) => {
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

                const distance = DistanceHelper.getManhattanDistance({
                    x: collider.x - player!.centerPosition.x,
                    y: collider.y - player!.centerPosition.y,
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

    isInScreen(position: Vector) {
        const { currState, stageTwoState } = this.game;

        if (currState === stageTwoState) {
            return true;
        }
        if (position.x > this.position.x + this.screenSize / 2 || position.x < this.position.x - this.screenSize / 2) {
            return false;
        }

        return !(position.y > this.position.y + this.screenSize / 2 || position.y < this.position.y - this.screenSize / 2);
    }

    checkEntity(object: CombinedPiece): object is CrystalSpider | CrystalBrute {
        return object instanceof CrystalSpider || object instanceof CrystalBrute;
    }

    checkInteractables(object: CombinedPiece): object is Medkit | Coin {
        return object instanceof Medkit || object instanceof Coin;
    }

    checkElevator(object: CombinedPiece): object is Elevator {
        return object instanceof Elevator;
    }

    updatePlayer(yAbsPosition: number, colliders) {
        const { player } = this.game;

        if (player!.currState === player!.inElevatorState) {
            return false;
        }

        const { centerPosition, height } = player!;

        const playerY = centerPosition.y + height;

        if (yAbsPosition < playerY) {
            return false;
        }

        player!.updateState(colliders);
        return true;
    }

    private getCameraSides() {
        return {
            top: this.position.y,
            bottom: this.position.y + this.height / 2,
            left: this.position.x,
            right: this.position.x + this.width / 2,
        };
    }

    private getTranslatePosition({ position, length }) {
        return position - length;
    }

    private translateCamera(direction: string[], moveDirection?: Vector) {
        const { player } = this.game;

        if (direction.includes('d')) {
            const displacement = moveDirection?.x || Math.abs(player!.velocity.x);
            this.game.ctx.translate(-displacement, 0);
            this.position.x += displacement;
        }
        if (direction.includes('a')) {
            const displacement = moveDirection?.x || Math.abs(player!.velocity.x);
            this.game.ctx.translate(displacement, 0);
            this.position.x -= displacement;
        }
        if (direction.includes('w')) {
            const displacement = moveDirection?.y || Math.abs(player!.velocity.y);
            this.game.ctx.translate(0, displacement);
            this.position.y -= displacement;
        }
        if (direction.includes('s')) {
            const displacement = moveDirection?.y || Math.abs(player!.velocity.y);
            this.game.ctx.translate(0, -displacement);
            this.position.y += displacement;
        }
    }
}
