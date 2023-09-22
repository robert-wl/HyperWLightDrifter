import JudgementBaseState from './JudgementBaseState.js';
import { drawMirroredY } from '../../../../helper/renderer/drawer.js';
import JudgementBullet from '../JudgementBullet.js';
import { getNumberedImage } from '../../../../helper/imageLoader.js';
import { getRandomValue } from '../../../../helper/randomHelper.js';
import { getFaceDirection } from '../../../../helper/collision/directionHandler.js';
import GameSettings from '../../../../constants.js';
import AudioPlayer from '../../../../../audio/AudioPlayer.js';

export default class JudgementAttackState extends JudgementBaseState {
    enterState() {
        this.number = 0;
        this.animationStage = 1;
        this.maxAttackCount =
            getRandomValue({
                randomValue: 8,
                rounded: true,
            }) + 5;
        this.attackCount = 0;
        this.attacking = false;
        this.attackAngle = getRandomValue({
            randomValue: Math.PI * 2,
        });
    }

    drawImage(currJudgement) {
        const judgementAttack = getNumberedImage('judgement_attack', this.animationStage);

        drawMirroredY({
            img: judgementAttack,
            position: {
                x: currJudgement.position.x,
                y: currJudgement.position.y,
            },
            width: judgementAttack.width * GameSettings.GAME.GAME_SCALE,
            height: judgementAttack.height * GameSettings.GAME.GAME_SCALE,
            translate: true,
            mirrored: getFaceDirection(currJudgement.angle) === 'left',
        });
    }

    updateState(currJudgement) {
        this.number += 1;

        if (this.number === 15) {
            this.number = 0;
            this.animationStage += 1;
        }

        this.attack(currJudgement);

        if (this.animationStage === 7) {
            this.animationStage -= 3;
            this.attackCount += 1;
        }

        if (this.animationStage === 4) {
            this.attacking = true;
        }

        if (this.attackCount === this.maxAttackCount) {
            currJudgement.handleSwitchState();
        }
    }

    attack(currJudgement) {
        if (this.attacking && this.number % 2 === 0) {
            this.attackAngle += getRandomValue({
                initialValue: (2 / 30) * Math.PI,
                randomValue: (1 / 45) * Math.PI,
            });

            let offset = 15;
            if (getFaceDirection(currJudgement.angle) === 'left') {
                offset = -15;
            }

            JudgementBullet.generate({
                x: currJudgement.position.x + offset,
                y: currJudgement.position.y - 40,
                angle: this.attackAngle,
            });

            JudgementBullet.generate({
                x: currJudgement.position.x + offset,
                y: currJudgement.position.y - 40,
                angle: this.attackAngle + Math.PI,
            });
        }

        if (this.attacking && this.number % 8 === 0) {
            AudioPlayer.getInstance().playAudio('boss/bullet.wav');
        }
    }
}
