import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import Game from '../../../Game/Game.js';
import { getHorizontalValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getImage } from '../../../../helper/imageLoader.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from '../../../../constants.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';

export default class CrystalBruteDieState extends CrystalBruteBaseState {
    enterState(currBrute) {
        this.friction = 0.1;
        const { audio, enemyManager } = Game.getInstance();

        enemyManager.enemyAliveCount -= 5;
        audio.playAudio('enemy/crystal_brute/die.wav');
    }

    updateState(currBrute) {
        const { deltaTime, movementDeltaTime } = Game.getInstance();
        currBrute.position.x += getHorizontalValue({
            magnitude: currBrute.speed * deltaTime,
            angle: currBrute.angle,
        });
        currBrute.position.y += getVerticalValue({
            magnitude: currBrute.speed * deltaTime,
            angle: currBrute.angle,
        });

        currBrute.speed *= 1 - this.friction * movementDeltaTime;
    }

    drawImage(currBrute) {
        const bruteDie = getImage('crystal_brute_die');

        drawImage({
            img: bruteDie,
            x: currBrute.position.x,
            y: currBrute.position.y,
            width: bruteDie.width * GameSettings.GAME.GAME_SCALE,
            height: bruteDie.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: getFaceDirection(currBrute.angle) === 'left',
        });
    }
}
