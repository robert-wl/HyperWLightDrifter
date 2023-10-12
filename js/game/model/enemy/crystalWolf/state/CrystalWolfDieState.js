import CrystalWolfBaseState from './CrystalWolfBaseState.js';
import Game from '../../../Game/Game.js';
import { getHorizontalValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getImage } from '../../../../helper/imageLoader.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';

export default class CrystalWolfDieState extends CrystalWolfBaseState {
    enterState(currWolf) {
        super.enterState(currWolf);
        this.friction = 0.1;

        const { audio, enemyManager } = Game.getInstance();

        enemyManager.enemyAliveCount -= 1;
        audio.playAudio('enemy/crystal_spider/die.wav');
    }

    drawImage(currWolf) {
        const { deltaTime, movementDeltaTime } = Game.getInstance();

        currWolf.speed = currWolf.speed * (1 - this.friction) * movementDeltaTime;

        currWolf.position.x += getHorizontalValue({
            magnitude: currWolf.speed * deltaTime,
            angle: currWolf.angle,
        });

        currWolf.position.y += getVerticalValue({
            magnitude: currWolf.speed * deltaTime,
            angle: currWolf.angle,
        });

        const wolfDie = getImage('crystal_wolf_die');

        drawImage({
            img: wolfDie,
            x: currWolf.position.x,
            y: currWolf.position.y,
            width: currWolf.width,
            height: currWolf.height,
            translate: true,
            mirrored: getFaceDirection(currWolf.angle) === 'left',
        });
    }
}
