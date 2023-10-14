import { drawImage } from '../../../helper/renderer/drawer.js';
import GameSettings from '../../../constants.js';

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
        camera.upperLayers.forEach((object, positionStr) => {
            const position = {
                x: Number(positionStr.split(',')[0]) * (object.width - 1) * GameSettings.GAME.GAME_SCALE,
                y: Number(positionStr.split(',')[1]) * (object.height - 1) * GameSettings.GAME.GAME_SCALE,
            };

            if (position.x > camera.position.x + SCREEN_WIDTH / 2 || position.x < camera.position.x - SCREEN_WIDTH / 2) {
                return;
            }

            if (position.y > camera.position.y + SCREEN_WIDTH / 2 || position.y < camera.position.y - SCREEN_WIDTH / 2) {
                return;
            }

            object.update();
        });
    }

    exitState(camera) {}
}
