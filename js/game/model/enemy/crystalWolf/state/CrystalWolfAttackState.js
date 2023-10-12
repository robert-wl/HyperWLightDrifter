import CrystalWolfBaseState from './CrystalWolfBaseState.js';
import Game from '../../../Game/Game';
import { getHorizontalValue, getVerticalValue } from '../../../../helper/distanceHelper';
import playerCollision from '../../../../helper/collision/playerCollision';
import { getNumberedImage } from '../../../../helper/imageLoader';
import { getFaceDirection } from '../../../../helper/collision/directionHandler';

export default class CrystalWolfAttackState extends CrystalWolfBaseState {
    enterState(currWolf) {
        super.enterState(currWolf);
        this.angle = currWolf.angle;
        this.attackDrag = 0.25;

        currWolf.attackSpeed = 20;

        const { audio } = Game.getInstance();
        audio.playAudio('enemy/crystal_spider/attack.wav');
    }

    updateState(currWolf) {
        super.updateState(currWolf);
        const { deltaTime, movementDeltaTime } = Game.getInstance();

        if (this.checkCounterReversed(10)) {
            currWolf.attackSpeed = 20;
        }

        if (this.checkCounter(20)) {
            currWolf.switchState(currWolf.moveState);
        }

        currWolf.attackSpeed = currWolf.attackSpeed * (1 - this.attackDrag * movementDeltaTime);

        currWolf.position.x += getHorizontalValue({
            magnitude: currWolf.attackSpeed * deltaTime,
            angle: this.angle,
        });

        currWolf.position.y += getVerticalValue({
            magnitude: currWolf.attackSpeed * deltaTime,
            angle: this.angle,
        });

        playerCollision({
            position: {
                x: currWolf.position.x,
                y: currWolf.position.y,
            },
            angle: this.angle,
        });

        this.advanceAnimationStage(4, 4);
    }

    drawImage(currWolf) {
        const wolfAttack = getNumberedImage('crystal_wolf_attack', this.animationStage);

        drawImage({
            img: wolfAttack,
            x: currWolf.position.x,
            y: currWolf.position.y,
            width: currWolf.width,
            height: currWolf.height,
            translate: true,
            mirrored: getFaceDirection(this.angle) === 'left',
        });
    }
}
