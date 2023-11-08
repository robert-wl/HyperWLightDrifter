import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import Game from '../../../game/Game.js';
import { getHorizontalValue, getManhattanDistance, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getImage } from '../../../../helper/assets/assetGetter.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import GameSettings from '../../../../constants.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import { getRandomBoolean } from '../../../../helper/randomHelper.js';
import CrystalBrute from '../CrystalBrute';

export default class CrystalBruteDieState extends CrystalBruteBaseState {
    private friction: number;

    public constructor() {
        super();
        this.friction = 0.1;
    }

    public enterState(currBrute: CrystalBrute) {
        const { audio, enemyManager } = Game.getInstance();

        if (getRandomBoolean(0.5)) {
            currBrute.enemyObserver.notify('spawnKey', currBrute.position);
        }

        audio.playAudio('enemy/crystal_brute/death.wav');
    }

    public updateState(currBrute: CrystalBrute) {
        const { deltaTime, movementDeltaTime, player } = Game.getInstance();
        currBrute.position.x += getHorizontalValue({
            magnitude: currBrute.speed * deltaTime,
            angle: currBrute.angle,
        });
        currBrute.position.y += getVerticalValue({
            magnitude: currBrute.speed * deltaTime,
            angle: currBrute.angle,
        });

        currBrute.speed *= 1 - this.friction * movementDeltaTime;

        const { centerPosition } = player;
        const distance = getManhattanDistance({
            x: currBrute.position.x - centerPosition.x,
            y: currBrute.position.y - centerPosition.y,
        });

        if (distance > 1000) {
            currBrute.enemyObserver.notify('clearEnemy', currBrute);
        }
    }

    public drawImage(currBrute: CrystalBrute) {
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
