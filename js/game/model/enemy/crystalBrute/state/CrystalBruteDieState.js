import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import Game from '../../../Game/Game.js';
import { getHorizontalValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getImage } from '../../../../helper/imageLoader.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from '../../../../constants.js';
import EnemyManager from "../../EnemyManager.js";

export default class CrystalBruteDieState extends CrystalBruteBaseState {
    enterState(currBrute) {
        EnemyManager.getInstance().enemyAliveCount -= 5;
    }

    updateState(currBrute) {
        currBrute.position.x += getHorizontalValue({
            magnitude: currBrute.speed,
            angle: currBrute.angle,
        });
        currBrute.position.y += getVerticalValue({
            magnitude: currBrute.speed,
            angle: currBrute.angle,
        });

        currBrute.speed *= 0.9;
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
        });
    }
}
