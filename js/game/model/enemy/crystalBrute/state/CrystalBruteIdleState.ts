import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import Game from '../../../game/Game.js';
import { getMagnitudeValue } from '../../../../helper/distanceHelper.js';
import { getImage } from '../../../../helper/assets/assetGetter.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import CrystalBrute from '../CrystalBrute';

export default class CrystalBruteIdleState extends CrystalBruteBaseState {
    updateState(currBrute: CrystalBrute) {
        const { player } = Game.getInstance();

        const distance = getMagnitudeValue({
            x: player.centerPosition.x - currBrute.position.x,
            y: player.centerPosition.y - currBrute.position.y,
        });

        if (distance < 250) {
            currBrute.switchState(currBrute.moveState);
        }
    }

    drawImage(currBrute: CrystalBrute) {
        const bruteIdle = getImage('crystal_brute_idle');

        drawImage({
            img: bruteIdle,
            x: currBrute.position.x,
            y: currBrute.position.y,
            width: currBrute.width,
            height: currBrute.height,
            translate: true,
            mirrored: getFaceDirection(currBrute.angle) === 'left',
        });
    }
}
