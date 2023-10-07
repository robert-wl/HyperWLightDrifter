import JudgementBaseState from './JudgementBaseState.js';
import Game from '../../../Game/Game.js';
import JudgementLaser from '../JudgementLaser.js';
import { drawImage } from '../../../../helper/renderer/drawer.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import GameSettings from '../../../../constants.js';
import { getAngle } from '../../../../helper/angleHelper.js';
import AudioPlayer from '../../../../../audio/AudioPlayer.js';

export default class JudgementLaserState extends JudgementBaseState {
    async enterState(currJudgement) {
        super.enterState(currJudgement);
        this.attackCount = 0;
        this.attacking = 8;
        this.attackingNumber = 0;
        this.attackAmount = 0;
        this.angleConstant = 0;
        this.attackAngle = currJudgement.angle;

        this.audio = await AudioPlayer.getInstance().playAudio('boss/laser.wav');
    }

    drawImage(currJudgement) {
        const judgementLaser = getNumberedImage('judgement_laser', this.animationStage);

        drawImage({
            img: judgementLaser,
            x: currJudgement.position.x,
            y: currJudgement.position.y,
            width: judgementLaser.width * GameSettings.GAME.GAME_SCALE,
            height: judgementLaser.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: getFaceDirection(currJudgement.angle) === 'left',
        });
    }

    updateState(currJudgement) {
        super.updateState(currJudgement);

        this.advanceAnimationStage(12);

        const { player, deltaTime } = Game.getInstance();
        this.attackingNumber += deltaTime;
        this.angleConstant += deltaTime;
        this.attackAmount += deltaTime;

        if (this.animationStage === 8) {
            this.attackAngle = getAngle({
                x: player.centerPosition.x - currJudgement.position.x,
                y: player.centerPosition.y - (currJudgement.position.y + 40),
            });

            currJudgement.angle = this.attackAngle;
        }

        if (this.attacking < 8 && this.animationStage < 13 && this.attackAmount >= 1) {
            JudgementLaser.generate({
                x: currJudgement.position.x + this.getAttackOffset(currJudgement),
                y: currJudgement.position.y + 60,
                angle: this.getAttackAngle(currJudgement.angle),
            });
            this.attackAmount = 0;
        }

        if (this.animationStage === 9 && this.attackingNumber >= 14) {
            this.attacking -= 1;
            this.attackingNumber = 0;
        }

        if (this.animationStage === 13 && this.attacking > 0) {
            this.animationStage -= 4;
        }

        if (this.animationStage >= 14) {
            currJudgement.switchState(currJudgement.moveState);
        }
    }

    getAttackAngle(angle) {
        return angle + (Math.random() - 0.5) * 0.25 + Math.sin(this.angleConstant * 0.05) * 0.5;
    }

    getAttackOffset(currJudgement) {
        return getFaceDirection(currJudgement.angle) === 'left' ? -60 : 60;
    }

    exitState() {
        AudioPlayer.getInstance().stop(this.audio);
    }
}
