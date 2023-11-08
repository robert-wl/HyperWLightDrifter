import CrystalBruteBaseState from './CrystalBruteBaseState.js';
import Game from '../../../game/Game.js';
import { getRandomBoolean, getRandomValue } from '../../../../helper/randomHelper.js';
import { getHorizontalValue, getMagnitudeValue, getVerticalValue } from '../../../../helper/distanceHelper.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import { getNumberedImage } from '../../../../helper/assets/assetGetter.js';
import CrystalBrute from '../CrystalBrute';

export default class CrystalBruteMoveState extends CrystalBruteBaseState {
    private clockwise = true;
    private moveTime = 0;
    private attackDelay = 0;

    public enterState(currBrute: CrystalBrute) {
        this.clockwise = getRandomBoolean(0.5);
        this.moveTime = 0;
        this.attackDelay = getRandomValue({
            initialValue: 100,
            randomValue: 100,
        });

        currBrute.speed = 0.5;
    }

    public updateState(currBrute: CrystalBrute) {
        super.updateState(currBrute);
        const { deltaTime } = Game.getInstance();
        this.moveTime += deltaTime;

        this.advanceAnimationStage(20, 6);

        if (this.checkCounter(20) && (this.animationStage === 0 || this.animationStage === 3)) {
            const { audio } = Game.getInstance();
            audio.playAudio('enemy/crystal_brute/walk.wav');
        }

        if (currBrute.health <= 0) {
            currBrute.switchState(currBrute.dieState);
            return;
        }

        if (this.moveTime > this.attackDelay) {
            currBrute.switchState(currBrute.attackState);
            return;
        }

        this.handleMovement(currBrute);
    }

    public drawImage(currBrute: CrystalBrute) {
        const bruteWalk = getNumberedImage('crystal_brute_walk', this.animationStage);

        drawImage({
            img: bruteWalk,
            x: currBrute.position.x,
            y: currBrute.position.y,
            width: currBrute.width,
            height: currBrute.height,
            translate: true,
            mirrored: getFaceDirection(currBrute.angle) === 'left',
        });
    }

    private handleMovement(currBrute: CrystalBrute) {
        const { player, deltaTime } = Game.getInstance();
        const { centerPosition } = player;

        const distance = getMagnitudeValue({
            x: centerPosition.x - currBrute.position.x,
            y: centerPosition.y - currBrute.position.y,
        });

        let angle = getAngle({
            x: centerPosition.x - currBrute.position.x,
            y: centerPosition.y - currBrute.position.y,
        });

        currBrute.angle = angle;

        if (distance > 750) {
            currBrute.switchState(currBrute.idleState);
            return;
        }

        if (distance < 200) {
            angle = this.getRotateAngle(currBrute.angle);
        }

        currBrute.position.x += getHorizontalValue({
            magnitude: currBrute.speed * deltaTime,
            angle: angle,
        });

        currBrute.position.y += getVerticalValue({
            magnitude: currBrute.speed * deltaTime,
            angle: angle,
        });
    }

    private getRotateAngle(angle: number) {
        return angle + (Math.PI / 2) * (this.clockwise ? 1 : -1);
    }
}
