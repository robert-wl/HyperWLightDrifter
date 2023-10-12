import CrystalWolfBaseState from './CrystalWolfBaseState.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import Game from '../../../Game/Game.js';
import { getHorizontalValue, getMagnitudeValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import { getRandomBoolean } from '../../../../helper/randomHelper.js';

export default class CrystalWolfMoveState extends CrystalWolfBaseState {
    enterState(currWolf) {
        super.enterState(currWolf);
        this.clockwise = getRandomBoolean(0.5);
        this.moveTime = 0;
        this.attackCooldown = 100;
    }

    updateState(currWolf) {
        super.updateState(currWolf);
        const { deltaTime } = Game.getInstance();
        this.moveTime += deltaTime;

        if (Math.round(this.moveTime) % 40 === 0) {
            const { audio } = Game.getInstance();
            audio.playAudio('enemy/crystal_wolf/walk.wav');
        }

        this.handleMovement(currWolf);
        this.advanceAnimationStage(4, 8);
    }

    drawImage(currWolf) {
        const wolfMove = getNumberedImage('crystal_wolf_walk', this.animationStage);

        drawImage({
            img: wolfMove,
            x: currWolf.position.x,
            y: currWolf.position.y,
            width: currWolf.width,
            height: currWolf.height,
            translate: true,
            mirrored: getFaceDirection(currWolf.angle) === 'left',
        });
    }

    getRotateAngle(angle) {
        return angle + (Math.PI / 2) * (this.clockwise ? 1 : -1);
    }

    handleMovement(currWolf) {
        const { player, deltaTime } = Game.getInstance();
        const { centerPosition } = player;
        const speed = currWolf.speed * deltaTime;

        const distance = getMagnitudeValue({
            x: centerPosition.x - currWolf.position.x,
            y: centerPosition.y - currWolf.position.y,
        });

        if (distance < 100 && this.moveTime > this.attackCooldown) {
            currWolf.switchState(currWolf.attackState);
            return;
        }

        let angle = getAngle({
            x: centerPosition.x - currWolf.position.x,
            y: centerPosition.y - currWolf.position.y,
        });

        currWolf.angle = angle;

        if (distance < 100) {
            angle = this.getRotateAngle(currWolf.angle);
        }

        currWolf.position.x += getHorizontalValue({
            magnitude: speed,
            angle: angle,
        });

        currWolf.position.y += getVerticalValue({
            magnitude: speed,
            angle: angle,
        });
    }
}
