import { drawImage, drawImageFromBottom } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';
import Game from '../../Game/Game.js';

const SCREEN_WIDTH = 1920;
export default class CameraBaseState {
    enterState(camera) {}

    updateState(camera) {}

    renderLowerLayer(camera) {
        camera.lowerLayers.forEach((background, positionStr) => {
            const position = {
                x: Number(positionStr.split(',')[0]) * (background.width - 1) * GameSettings.GAME.GAME_SCALE,
                y: Number(positionStr.split(',')[1]) * (background.height - 1) * GameSettings.GAME.GAME_SCALE,
            };

            if (position.x > camera.position.x + SCREEN_WIDTH / 2 || position.x < camera.position.x - SCREEN_WIDTH / 2) {
                return;
            }

            if (position.y > camera.position.y + SCREEN_WIDTH / 2 || position.y < camera.position.y - SCREEN_WIDTH / 2) {
                return;
            }

            drawImage({
                img: background,
                x: position.x,
                y: position.y,
                width: background.width * GameSettings.GAME.GAME_SCALE,
                height: background.height * GameSettings.GAME.GAME_SCALE,
            });
        });
    }

    renderUpperLayer(camera) {
        let hasUpdatedPlayer = false;
        const objects = [];
        const colliders = [];
        camera.upperLayers.forEach((object, positionStr) => {
            const position = {
                y: Number(positionStr.split(',')[0]) * GameSettings.GAME.FOREST_STAGE.FLOOR_WIDTH * GameSettings.GAME.GAME_SCALE,
                x: Number(positionStr.split(',')[1]) * GameSettings.GAME.FOREST_STAGE.FLOOR_WIDTH * GameSettings.GAME.GAME_SCALE,
            };

            if (position.x > camera.position.x + SCREEN_WIDTH / 2 || position.x < camera.position.x - SCREEN_WIDTH / 2) {
                return;
            }

            if (position.y > camera.position.y + SCREEN_WIDTH / 2 || position.y < camera.position.y - SCREEN_WIDTH / 2) {
                return;
            }

            object.pieces.forEach((piece) => {
                const { collider } = piece;
                colliders.push(collider);
                objects.push(piece);
            });
        });

        objects.sort((pieceOne, pieceTwo) => {
            return pieceOne.position.y - pieceTwo.position.y;
        });

        objects.forEach((piece) => {
            const { image, position, flipped } = piece;

            if (!hasUpdatedPlayer) {
                hasUpdatedPlayer = this.updatePlayer(position.y, colliders);
            }

            drawImageFromBottom({
                img: image,
                x: position.x,
                y: position.y,
                width: image.width * GameSettings.GAME.GAME_SCALE,
                height: image.height * GameSettings.GAME.GAME_SCALE,
                mirrored: flipped,
            });
        });

        if (!hasUpdatedPlayer) {
            const { player } = Game.getInstance();
            player.updateState(colliders);
        }
    }

    updatePlayer(yAbsPosition, colliders) {
        const { player } = Game.getInstance();
        const { centerPosition, height } = player;

        const playerY = centerPosition.y + height;

        if (yAbsPosition < playerY) {
            return false;
        }

        player.updateState(colliders);
        return true;
    }

    exitState(camera) {}
}
