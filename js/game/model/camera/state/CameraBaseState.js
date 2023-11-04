import { drawImage, drawImageFromBottom } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';
import Game from '../../Game/Game.js';
import { getManhattanDistance } from '../../../helper/distanceHelper.js';
import Medkit from '../../interactables/Medkit.js';
import CrystalSpider from '../../enemy/crystalSpider/CrystalSpider.js';
import CrystalBrute from '../../enemy/crystalBrute/CrystalBrute.js';
import Key from '../../interactables/Key.js';
import Elevator from '../../interactables/Elevator/Elevator.js';

const SCREEN_SIZE = 1920;
export default class CameraBaseState {
    renderLowerLayer(camera) {
        const { GAME_SCALE } = GameSettings.GAME;
        camera.lowerLayers.forEach((background, positionStr) => {
            const position = {
                x: Number(positionStr.split(',')[0]) * (background.width - 1) * GAME_SCALE,
                y: Number(positionStr.split(',')[1]) * (background.height - 1) * GAME_SCALE,
            };

            if (!this.isInScreen(camera, position)) {
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

    renderUpperLayer(camera) {
        let hasUpdatedPlayer = false;

        const { player } = Game.getInstance();
        const { GAME_SCALE } = GameSettings.GAME;

        const { objects, colliders } = this.getObjects(camera);

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
                return;
            }

            const { image, position, flipped } = piece;

            if (!hasUpdatedPlayer) {
                hasUpdatedPlayer = this.updatePlayer(position.y, colliders);
            }

            // console.log(piece);
            drawImageFromBottom({
                img: image,
                x: position.x,
                y: position.y,
                width: image.width * GAME_SCALE,
                height: image.height * GAME_SCALE,
                mirrored: flipped,
            });
        });

        Game.getInstance().interactables = interactables;
        Game.getInstance().elevators = elevators;
        if (!hasUpdatedPlayer && player.currState !== player.inElevatorState) {
            player.updateState(colliders);
        }
    }

    getObjects(camera) {
        const { player, enemyManager, coins } = Game.getInstance();
        const { GAME_SCALE, FOREST_STAGE } = GameSettings.GAME;
        const objects = [];
        const colliders = [];
        const enemyList = enemyManager.enemyList;

        camera.upperLayers.forEach((object, positionStr) => {
            const position = {
                y: Number(positionStr.split(',')[0]) * FOREST_STAGE.FLOOR_WIDTH * GAME_SCALE,
                x: Number(positionStr.split(',')[1]) * FOREST_STAGE.FLOOR_WIDTH * GAME_SCALE,
            };

            if (!this.isInScreen(camera, position)) {
                return;
            }

            object.pieces.forEach((piece) => {
                const { collider } = piece;

                if (!collider) {
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

        objects.push(...enemyList);
        objects.sort((pieceOne, pieceTwo) => {
            let positionOne = pieceOne.position.y;
            let positionTwo = pieceTwo.position.y;

            if (this.checkEntity(pieceOne)) {
                positionOne += pieceOne.height / 2;
            }
            if (this.checkEntity(pieceTwo)) {
                positionTwo += pieceTwo.height / 2;
            }
            return positionOne - positionTwo;
        });

        objects.push(...coins);
        return { objects, colliders };
    }

    isInScreen(camera, position) {
        const { currState, stageTwoState } = Game.getInstance();

        if (currState === stageTwoState) {
            return true;
        }
        if (position.x > camera.position.x + SCREEN_SIZE / 2 || position.x < camera.position.x - SCREEN_SIZE / 2) {
            return false;
        }

        return !(position.y > camera.position.y + SCREEN_SIZE / 2 || position.y < camera.position.y - SCREEN_SIZE / 2);
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

    enterState(_camera) {}

    exitState(_camera) {}
}
