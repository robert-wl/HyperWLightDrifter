import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import Game from '../../../game/Game.js';
import GameSettings from '../../../../constants.js';
import CrystalBrute from '../CrystalBrute.js';
import AssetManager from '../../../utility/manager/AssetManager.js';
import DirectionHelper from '../../../utility/helper/DirectionHelper.js';
import RandomHelper from '../../../utility/helper/RandomHelper.js';
import AudioManager from '../../../utility/manager/AudioManager.js';
import DistanceHelper from '../../../utility/helper/DistanceHelper.js';
import { PolarVector } from '../../../utility/interfaces/PolarVector.js';
import { Box } from '../../../utility/interfaces/Box.js';
import DrawHelper from '../../../utility/helper/DrawHelper.js';

export default class CrystalBruteDieState extends CrystalBruteBaseState {
    private readonly friction: number;

    public constructor() {
        super();
        this.friction = 0.1;
    }

    public enterState(currBrute: CrystalBrute) {
        if (RandomHelper.getRandomBoolean(0.5)) {
            currBrute.enemyObserver.notify('spawnCoin', currBrute.position);
        }

        AudioManager.playAudio('player_key_pickup_audio').then();
    }

    public updateState(currBrute: CrystalBrute) {
        const { player } = Game.getInstance();
        const pVector = new PolarVector(currBrute.speed * Game.deltaTime, currBrute.angle);
        currBrute.position.x += DistanceHelper.getHorizontalValue(pVector);
        currBrute.position.y += DistanceHelper.getVerticalValue(pVector);

        currBrute.speed *= 1 - this.friction * Game.movementDeltaTime;

        const { centerPosition } = player;
        const distance = DistanceHelper.getManhattanDistance({
            x: currBrute.position.x - centerPosition.x,
            y: currBrute.position.y - centerPosition.y,
        });

        if (distance > 1000) {
            currBrute.enemyObserver.notify('clearEnemy', currBrute);
        }
    }

    public drawImage(currBrute: CrystalBrute) {
        const bruteDie = AssetManager.getImage('crystal_brute_die');

        const imageSize = Box.parse({
            x: currBrute.position.x,
            y: currBrute.position.y,
            w: bruteDie.width * GameSettings.GAME.GAME_SCALE,
            h: bruteDie.height * GameSettings.GAME.GAME_SCALE,
        });

        DrawHelper.drawImage(bruteDie, imageSize, true, DirectionHelper.getFaceDirection(currBrute.angle) === 'left');
    }
}
