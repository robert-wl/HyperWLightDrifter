import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import Game from '../../../game/Game.js';
import CrystalBrute from '../CrystalBrute.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
import DistanceHelper from '../../../utility/helper/DistanceHelper.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';
import GameSettings from '../../../../constants.js';
import { Vector } from '../../../utility/interfaces/Vector.js';

export default class CrystalBruteIdleState extends CrystalBruteBaseState {
    updateState(currBrute: CrystalBrute) {
        const { player } = Game.getInstance();

        const distance = DistanceHelper.getMagnitude(
            Vector.parse({
                x: player.centerPosition.x - currBrute.position.x,
                y: player.centerPosition.y - currBrute.position.y,
            }),
        );

        if (distance < 250) {
            currBrute.switchState(currBrute.moveState);
        }
    }

    drawImage(currBrute: CrystalBrute) {
        const bruteIdle = AssetManager.getImage('crystal_brute_idle');

        const imageSize = Box.parse({
            x: currBrute.position.x,
            y: currBrute.position.y,
            w: bruteIdle.width * GameSettings.GAME.GAME_SCALE,
            h: bruteIdle.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(bruteIdle, imageSize, true, DirectionHelper.getFaceDirection(currBrute.angle) === 'left');
    }
}
